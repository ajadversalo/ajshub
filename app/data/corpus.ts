/**
 * RAG corpus: one self-contained chunk per fact on the site.
 *
 * Chunks are embedded with Gemini and upserted into Cloudflare Vectorize.
 *
 * @packageDocumentation
 */

import {
  COPY,
  EMAIL,
  GITHUB_URL,
  HASH,
  LINKEDIN_URL,
  LOCATION,
  PERSON_NAME,
  ROLE,
  ROUTES,
  SITE_URL,
} from "../constants";
import { experience } from "./experience";
import { beyondProjects, toolboxGroups } from "./portfolio";
import { roles, skills } from "./resume";
import {
  buildTechRecords,
  summaryPassage,
  techPassage,
  undatedTechPassage,
} from "./tech-index";

/** One retrievable passage stored in the vector index. */
export type CorpusChunk = {
  id: string;
  title: string;
  url: string;
  source: string;
  text: string;
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Vectorize ids max out at 64 bytes. */
function companyKey(name: string) {
  return slug(name.split(/\s+/)[0] ?? name);
}

function passage(...parts: string[]) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/** All site copy that the Ask panel can retrieve. */
export function buildCorpus(): CorpusChunk[] {
  const chunks: CorpusChunk[] = [
    {
      id: "profile",
      title: `${PERSON_NAME} — profile`,
      url: ROUTES.home,
      source: "home",
      text: passage(
        `${PERSON_NAME} is a product-minded ${ROLE} in ${LOCATION}.`,
        COPY.heroBio,
        COPY.resumeSummary,
      ),
    },
    {
      id: "contact",
      title: "Contact",
      url: ROUTES.resume,
      source: "contact",
      text: passage(
        `Contact ${PERSON_NAME} by email at ${EMAIL}.`,
        `GitHub: ${GITHUB_URL}.`,
        `LinkedIn: ${LINKEDIN_URL}.`,
      ),
    },
    {
      id: "site-rag",
      title: "How this Ask panel works",
      url: ROUTES.home,
      source: "site",
      text: passage(
        `The Ask panel on ${SITE_URL} is a retrieval-augmented generation demo built by ${PERSON_NAME}.`,
        "Site copy is split into chunks, embedded with Gemini gemini-embedding-001 at 768 dimensions,",
        "and stored in a Cloudflare Vectorize index named portfolio-rag with cosine similarity.",
        "A question is embedded the same way, Vectorize returns the nearest chunks, and Gemini 3.5 Flash-Lite answers using only that retrieved context.",
        "If Vectorize or Gemini is unavailable, retrieval falls back to lexical search over the same chunks.",
      ),
    },
    {
      id: "site-stack",
      title: "This website",
      url: ROUTES.home,
      source: "site",
      text: passage(
        `${SITE_URL} is ${PERSON_NAME}'s portfolio.`,
        "It is built with Next.js App Router APIs on vinext (Vite plus Next) and deployed as a Cloudflare Worker, with a static Pages export as a second artifact.",
      ),
    },
  ];

  for (const chapter of experience) {
    chunks.push({
      id: `exp-${companyKey(chapter.company)}`,
      title: chapter.company,
      url: `${ROUTES.home}${HASH.experience}`,
      source: "experience",
      text: passage(
        `${PERSON_NAME} worked at ${chapter.company} as ${chapter.discipline} (${chapter.marker}).`,
        chapter.intro,
        `Tech stack: ${chapter.stack.join(", ")}.`,
        `Products: ${chapter.products.map((product) => product.name).join(", ")}.`,
      ),
    });

    for (const product of chapter.products) {
      chunks.push({
        id: `p-${companyKey(chapter.company)}-${slug(product.name)}`,
        title: `${product.name} — ${chapter.company}`,
        url: `${ROUTES.home}${HASH.experience}`,
        source: "experience",
        text: passage(
          `${product.name} is a ${product.type} that ${PERSON_NAME} worked on at ${chapter.company}.`,
          product.note,
          `Areas: ${product.tags.join(", ")}.`,
          `Built with: ${chapter.stack.join(", ")}.`,
        ),
      });
    }
  }

  for (const role of roles) {
    chunks.push({
      id: `cv-${companyKey(role.company)}`,
      title: `${role.company} résumé`,
      url: ROUTES.resume,
      source: "resume",
      text: passage(
        `${PERSON_NAME} was ${role.role} at ${role.company} (${role.period}).`,
        role.summary,
        ...role.projects.map(([name, description]) => `${name}: ${description}`),
        `Stack: ${role.stack.join(", ")}.`,
      ),
    });
  }

  chunks.push({
    id: "skills",
    title: "Capabilities",
    url: ROUTES.resume,
    source: "resume",
    text: passage(
      `${PERSON_NAME}'s capabilities:`,
      ...skills.map(([category, items]) => `${category}: ${items}.`),
    ),
  });

  chunks.push({
    id: "summary",
    title: `${PERSON_NAME} — summary`,
    url: ROUTES.resume,
    source: "profile",
    text: summaryPassage(COPY, {
      email: EMAIL,
      github: GITHUB_URL,
      linkedin: LINKEDIN_URL,
      location: LOCATION,
    }),
  });

  for (const tech of buildTechRecords()) {
    chunks.push({
      id: `tech-${tech.id}`.slice(0, 64),
      title: `${tech.name} experience`,
      url: ROUTES.resume,
      source: "skills",
      text: techPassage(tech),
    });
  }

  chunks.push({
    id: "tech-undated",
    title: "Toolkit technologies without dated projects",
    url: `${ROUTES.home}${HASH.toolbox}`,
    source: "skills",
    text: undatedTechPassage(),
  });

  for (const group of toolboxGroups) {
    chunks.push({
      id: `tb-${slug(group.category)}`,
      title: group.category,
      url: `${ROUTES.home}${HASH.toolbox}`,
      source: "toolbox",
      text: passage(
        `${group.category}: ${group.description}`,
        `Tools: ${group.tools.join(", ")}.`,
      ),
    });
  }

  for (const project of beyondProjects) {
    chunks.push({
      id: `pj-${slug(project.title)}`,
      title: project.title,
      url: ROUTES.beyondWork,
      source: "beyond-work",
      text: passage(
        `${project.title} is a ${project.kind} side project by ${PERSON_NAME}.`,
        project.summary,
        `Live at ${project.href} (${project.host}).`,
        `Stack: ${project.stack.join(", ")}.`,
        `Hosted on ${project.hosted}.`,
        project.database ? `Database: ${project.database}.` : "",
      ),
    });
  }

  return chunks;
}

export const corpus = buildCorpus();

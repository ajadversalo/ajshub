/**
 * Inverted tech index for Ask: years, employers, and projects per technology.
 *
 * Built from experience, résumé, side projects, and this site so RAG can answer
 * “how many years with X”, “projects built with X”, and “list projects using X”
 * from one self-contained chunk.
 *
 * @packageDocumentation
 */

import { PERSON_NAME, ROLE, SITE_URL } from "../constants";
import { experience } from "./experience";
import { beyondProjects, toolboxGroups } from "./portfolio";
import { roles, skillGroups, yearsSince } from "./resume";

/** Inclusive start; omit `end` when the work is current. Month is 1-indexed. */
export type TenureSpan = {
  start: { year: number; month: number };
  end?: { year: number; month: number };
  label: string;
};

export type TechProject = {
  name: string;
  place: string;
};

export type TechRecord = {
  id: string;
  name: string;
  aliases: string[];
  spans: TenureSpan[];
  years: number | null;
  ongoing: boolean;
  sinceLabel: string | null;
  employers: string[];
  projects: TechProject[];
};

type CanonicalTech = {
  id: string;
  name: string;
  aliases: string[];
};

/** Dated employer blocks. Keys match `experience.company` / `roles.company`. */
export const EMPLOYER_TENURE: Record<string, Omit<TenureSpan, "label">> = {
  "Centra Construction Group": { start: { year: 2023, month: 6 } },
  "GenXys Healthcare Systems": {
    start: { year: 2019, month: 7 },
    end: { year: 2023, month: 6 },
  },
  "Earlier Technical Career": {
    start: { year: 2010, month: 1 },
    end: { year: 2018, month: 12 },
  },
};

const CANONICAL: CanonicalTech[] = [
  { id: "csharp-net", name: "C# and .NET", aliases: ["c#", ".net", "dotnet", "c sharp", "csharp", "asp.net"] },
  { id: "react", name: "React", aliases: ["react", "reactjs", "react.js"] },
  { id: "nextjs", name: "Next.js", aliases: ["next.js", "nextjs"] },
  { id: "typescript", name: "TypeScript", aliases: ["typescript"] },
  { id: "javascript", name: "JavaScript", aliases: ["javascript"] },
  { id: "redux", name: "Redux", aliases: ["redux"] },
  { id: "mui", name: "Material UI", aliases: ["material ui", "mui"] },
  { id: "antd", name: "Ant Design", aliases: ["ant design", "antd"] },
  { id: "tailwind", name: "Tailwind CSS", aliases: ["tailwind css", "tailwind"] },
  { id: "ef", name: "EF", aliases: ["ef", "entity framework", "entityframework"] },
  { id: "nodejs", name: "Node.js", aliases: ["node.js", "nodejs"] },
  { id: "express", name: "Express.js", aliases: ["express.js", "express"] },
  { id: "cloudflare-workers", name: "Cloudflare Workers", aliases: ["cloudflare workers"] },
  { id: "d1", name: "Cloudflare D1", aliases: ["cloudflare d1", "d1"] },
];

function fold(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

const canonicalByAlias = new Map<string, CanonicalTech>();
for (const row of CANONICAL) {
  canonicalByAlias.set(fold(row.name), row);
  for (const alias of row.aliases) canonicalByAlias.set(fold(alias), row);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function canonicalTech(raw: string): CanonicalTech {
  const hit = canonicalByAlias.get(fold(raw));
  if (hit) return hit;
  const name = raw.trim();
  return { id: slug(name) || "tech", name, aliases: [fold(name)] };
}

function tenureForCompany(company: string, periodLabel: string): TenureSpan | null {
  const tenure = EMPLOYER_TENURE[company];
  if (!tenure) return null;
  return { ...tenure, label: periodLabel };
}

function yearsForSpans(spans: TenureSpan[], now = new Date()) {
  if (spans.length === 0) return { years: null as number | null, ongoing: false, sinceLabel: null as string | null };

  let earliest = spans[0].start;
  let earliestKey = earliest.year * 12 + earliest.month;
  let latestEnd = spans[0].end ?? null;
  let latestKey = latestEnd ? latestEnd.year * 12 + latestEnd.month : 0;
  let ongoing = false;
  let sinceLabel = "";

  for (const span of spans) {
    const startKey = span.start.year * 12 + span.start.month;
    if (startKey < earliestKey) {
      earliest = span.start;
      earliestKey = startKey;
      sinceLabel = span.label;
    }
    if (!span.end) {
      ongoing = true;
      continue;
    }
    const endKey = span.end.year * 12 + span.end.month;
    if (!latestEnd || endKey > latestKey) {
      latestEnd = span.end;
      latestKey = endKey;
    }
  }

  if (!sinceLabel) sinceLabel = spans[0].label;

  const since = sinceLabel.split("—")[0]?.trim() || sinceLabel;
  if (ongoing) {
    return { years: yearsSince(earliest.year, earliest.month, now), ongoing, sinceLabel: since };
  }
  if (!latestEnd) return { years: null, ongoing: false, sinceLabel: since };
  return {
    years: yearsSince(earliest.year, earliest.month, new Date(latestEnd.year, latestEnd.month - 1, 1)),
    ongoing: false,
    sinceLabel: since,
  };
}

type Accumulator = {
  id: string;
  name: string;
  aliases: Set<string>;
  spans: TenureSpan[];
  employers: Map<string, string>;
  projects: Map<string, TechProject>;
};

function ensure(map: Map<string, Accumulator>, raw: string) {
  const canon = canonicalTech(raw);
  let row = map.get(canon.id);
  if (!row) {
    row = {
      id: canon.id,
      name: canon.name,
      aliases: new Set(canon.aliases),
      spans: [],
      employers: new Map(),
      projects: new Map(),
    };
    map.set(canon.id, row);
  }
  row.aliases.add(fold(raw));
  row.aliases.add(fold(canon.name));
  return row;
}

function addSpan(row: Accumulator, span: TenureSpan | null) {
  if (!span) return;
  const key = `${span.start.year}-${span.start.month}-${span.end?.year ?? "now"}-${span.end?.month ?? ""}`;
  if (row.spans.some((item) => `${item.start.year}-${item.start.month}-${item.end?.year ?? "now"}-${item.end?.month ?? ""}` === key)) {
    return;
  }
  row.spans.push(span);
}

function addProject(row: Accumulator, name: string, place: string) {
  const key = `${fold(name)}@${fold(place)}`;
  if (!row.projects.has(key)) row.projects.set(key, { name, place });
}

/** Skills implied by a dated stack item. Next.js work is React work. */
const IMPLIED_BY_ID: Record<string, string[]> = {
  nextjs: ["React", "JavaScript", "HTML", "CSS"],
  react: ["JavaScript", "HTML", "CSS"],
  typescript: ["JavaScript"],
};

/** Expand authored stacks with implied companion skills. */
function expandStack(stack: string[]) {
  const expanded = [...stack];
  for (const item of stack) {
    const extras = IMPLIED_BY_ID[canonicalTech(item).id];
    if (extras) expanded.push(...extras);
  }
  return expanded;
}

function addStack(
  map: Map<string, Accumulator>,
  stack: string[],
  options: { company?: string; period?: string; projects?: TechProject[] },
) {
  const span = options.company && options.period
    ? tenureForCompany(options.company, options.period)
    : null;

  for (const item of expandStack(stack)) {
    const row = ensure(map, item);
    addSpan(row, span);
    if (options.company && options.period) {
      row.employers.set(options.company, `${options.company} (${options.period})`);
    }
    for (const project of options.projects ?? []) addProject(row, project.name, project.place);
  }
}

function splitSkillItems(items: string) {
  return items
    .split(/\s*\|\s*|,\s*/)
    .map((item) => item.replace(/\s*\([^)]*years[^)]*\)\s*/i, "").trim())
    .filter(Boolean);
}

/** Technologies that appear on a dated stack or a named project. */
export function buildTechRecords(now = new Date()): TechRecord[] {
  const map = new Map<string, Accumulator>();

  for (const chapter of experience) {
    const products = chapter.products.map((product) => ({
      name: product.name,
      place: chapter.company,
    }));
    addStack(map, chapter.stack, {
      company: chapter.company,
      period: chapter.marker,
      projects: products,
    });
  }

  for (const role of roles) {
    const products = role.projects.map(([name]) => ({
      name,
      place: role.company,
    }));
    addStack(map, role.stack, {
      company: role.company,
      period: role.period,
      projects: products,
    });
  }

  for (const project of beyondProjects) {
    const stack = [...project.stack, project.hosted, project.database].filter(
      (item): item is string => Boolean(item),
    );
    addStack(map, stack, {
      projects: [{ name: project.title, place: "side project" }],
    });
  }

  addStack(map, ["Next.js", "vinext", "Cloudflare Workers"], {
    projects: [{ name: `${PERSON_NAME}'s portfolio (${SITE_URL})`, place: "this site" }],
  });

  return [...map.values()]
    .map((row) => {
      const { years, ongoing, sinceLabel } = yearsForSpans(row.spans, now);
      return {
        id: row.id,
        name: row.name,
        aliases: [...row.aliases].sort(),
        spans: row.spans,
        years,
        ongoing,
        sinceLabel,
        employers: [...row.employers.values()],
        projects: [...row.projects.values()],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Toolbox / résumé tools with no dated employer stack and no named project. */
export function undatedToolkitTools(records = buildTechRecords()) {
  const dated = new Set(records.map((record) => record.id));
  const names = new Set<string>();

  for (const group of toolboxGroups) {
    for (const tool of group.tools) {
      const canon = canonicalTech(tool);
      if (!dated.has(canon.id)) names.add(canon.name);
    }
  }

  for (const [, items] of skillGroups()) {
    for (const item of splitSkillItems(items)) {
      const canon = canonicalTech(item);
      if (!dated.has(canon.id)) names.add(canon.name);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

function yearsLabel(record: TechRecord) {
  if (record.years == null) return "years not stated";
  return record.sinceLabel
    ? `${record.years} years since ${record.sinceLabel}`
    : `${record.years} years`;
}

function projectsLabel(record: TechRecord) {
  if (record.projects.length === 0) return "none listed";
  return record.projects.map((project) => `${project.name} (${project.place})`).join("; ");
}

/** One list row: technology | years | projects. */
export function techLine(record: TechRecord) {
  return `${record.name} | ${yearsLabel(record)} | ${projectsLabel(record)}`;
}

function undatedRecords(tools = undatedToolkitTools()): TechRecord[] {
  return tools.map((name) => {
    const canon = canonicalTech(name);
    return {
      id: canon.id,
      name: canon.name,
      aliases: [...new Set([fold(name), ...canon.aliases])],
      spans: [],
      years: null,
      ongoing: false,
      sinceLabel: null,
      employers: [],
      projects: [],
    };
  });
}

/** Dated or shipped-project rows first, then toolkit rows with no dates. */
export function allTechRows(now = new Date()): { dated: TechRecord[]; undated: TechRecord[] } {
  const dated = buildTechRecords(now);
  return { dated, undated: undatedRecords(undatedToolkitTools(dated)) };
}

function listPassage(title: string, rows: TechRecord[]) {
  const sorted = [...rows].sort((a, b) => {
    const years = (b.years ?? -1) - (a.years ?? -1);
    return years !== 0 ? years : a.name.localeCompare(b.name);
  });
  return [
    title,
    "Each line is technology | years | projects.",
    ...sorted.map(techLine),
  ].join("\n");
}

/** Compact inventory of technologies that have a year count or a shipped project. */
export function techInventoryPassage(now = new Date()) {
  const { dated } = allTechRows(now);
  return listPassage(
    `${PERSON_NAME}'s technology list (years and projects on this site).`,
    dated,
  );
}

/** Toolkit names with no professional start date and no shipped project on this site. */
export function undatedTechPassage(tools = undatedToolkitTools()) {
  return listPassage(
    `${PERSON_NAME}'s toolkit technologies with no year count and no shipped project on this site.`,
    undatedRecords(tools),
  );
}

export function isTechCatalogQuestion(question: string) {
  return /\b(technolog(?:y|ies)|tech stack|what (?:tech|tools)|list (?:your )?skills|skills list)\b/i.test(question);
}

export function recordsForQuestion(question: string, now = new Date()): TechRecord[] {
  const { dated, undated } = allTechRows(now);
  return [...dated, ...undated].filter((record) => {
    const names = [record.name, ...record.aliases];
    return names.some((name) => mentionedIn(question, name));
  });
}

/**
 * Direct answer from the technology list so Ask does not dump unrelated chunks.
 * Returns null when the question does not name a technology or ask for the catalog.
 */
export function lookupTechAnswer(question: string, now = new Date()): string | null {
  const matched = recordsForQuestion(question, now);
  if (matched.length > 0) {
    return [
      "Each line is technology | years | projects.",
      ...matched.map(techLine),
    ].join("\n");
  }
  if (isTechCatalogQuestion(question)) {
    const { dated, undated } = allTechRows(now);
    return [techInventoryPassage(now), listPassage("Also in the toolkit:", undated)].join("\n\n");
  }
  return null;
}

export function summaryPassage(copy: { heroBio: string; resumeSummary: string }, extras: {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  now?: Date;
}) {
  const records = buildTechRecords(extras.now);
  const dotnet = records.find((record) => record.id === "csharp-net");
  const centra = experience.find((chapter) => chapter.company.startsWith("Centra"));
  const genxys = experience.find((chapter) => chapter.company.startsWith("GenXys"));
  const side = beyondProjects.map((project) => project.title).join(", ");

  return [
    `Summarize my info. Summary of ${PERSON_NAME}'s info, background, and profile.`,
    `${PERSON_NAME} is a product-minded ${ROLE} in ${extras.location}.`,
    copy.heroBio,
    copy.resumeSummary,
    "Career timeline: 2010 — 2018 application and systems administration across renewable energy, oil and gas, and manufacturing;",
    "July 2019 — June 2023 full-stack developer at GenXys Healthcare Systems;",
    "June 2023 — present senior software developer at Centra Construction Group.",
    centra
      ? `Centra products include ${centra.products.map((product) => product.name).join(", ")}.`
      : "",
    genxys
      ? `GenXys products include ${genxys.products.map((product) => product.name).join(", ")}.`
      : "",
    `Side projects: ${side}.`,
    dotnet?.years != null
      ? `Professional C# and .NET: ${dotnet.years} years since ${dotnet.sinceLabel}.`
      : "",
    `Contact: ${extras.email}, GitHub ${extras.github}, LinkedIn ${extras.linkedin}.`,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function mentionedIn(question: string, name: string) {
  const alias = fold(name);
  if (alias.length < 2) return false;
  const haystack = fold(question);
  if (alias.length <= 3) {
    return haystack.split(/[^a-z0-9+#./]+/).includes(alias);
  }
  return haystack.includes(alias);
}

/** Corpus chunk ids to prefer when a question names a technology. */
export function techChunkIdsForQuestion(question: string, records = buildTechRecords()) {
  const ids = new Set<string>();
  for (const record of records) {
    const names = [record.name, ...record.aliases];
    if (names.some((name) => mentionedIn(question, name))) ids.add(`tech-${record.id}`.slice(0, 64));
  }
  for (const tool of undatedToolkitTools(records)) {
    if (mentionedIn(question, tool)) ids.add("tech-undated");
  }
  return ids;
}

export function undatedTechPassage(tools = undatedToolkitTools()) {
  const list = tools.join(", ");
  return [
    `These toolkit technologies appear on the site without a professional start date or a named shipped product: ${list}.`,
    `The site does not state a year count for those tools.`,
    `No named project on this site lists those tools on its stack.`,
  ].join(" ");
}

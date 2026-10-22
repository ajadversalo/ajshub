/**
 * Side projects and toolbox groups shown on the site.
 *
 * @packageDocumentation
 */

import { IMAGES } from "../constants";

/** Personal project card on `/beyond-work`. */
export type BeyondProject = {
  title: string;
  kind: string;
  logo?: string;
  summary: string;
  href: string;
  host: string;
  stack: string[];
  hosted: string;
  database?: string;
};

export const beyondProjects: BeyondProject[] = [
  {
    title: "SouthFraserHUB",
    kind: "Local directory",
    logo: IMAGES.southfraserhubLogo,
    summary:
      "I wanted a simpler way for small South Fraser businesses to get found which usually get buried under chain results.",
    href: "https://southfraserhub.ca",
    host: "southfraserhub.ca",
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Leaflet"],
    hosted: "Cloudflare Workers",
    database: "Cloudflare D1",
  },
  {
    title: "WebTools",
    kind: "Windows catalog",
    logo: IMAGES.webtoolsLogo,
    summary:
      "A small catalog of Windows x64 utilities I keep on the desk, starting with Monitor Switch for toggling displays and jumping between layouts.",
    href: "https://webtools.ajhub.ca",
    host: "webtools.ajhub.ca",
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "C#", ".NET"],
    hosted: "Cloudflare Workers",
  },
  {
    title: "STLCraft",
    kind: "STL export lab",
    logo: IMAGES.stlcraftLogo,
    summary:
      "I wanted a quicker way to turn Font Awesome icons, text, and SVGs into print-ready STLs without opening a CAD app.",
    href: "https://stlcraft.ajhub.ca",
    host: "stlcraft.ajhub.ca",
    stack: ["Next.js", "TypeScript", "React", "Three.js", "Font Awesome"],
    hosted: "Cloudflare Workers",
  },
];

/** Filterable skill group in the homepage toolkit. */
export type ToolboxGroup = {
  category: string;
  description: string;
  tools: string[];
};

export const toolboxGroups: ToolboxGroup[] = [
  {
    category: "UI / Front-End",
    description: "Client-side languages, frameworks, and UI libraries used to design and ship interfaces.",
    tools: ["ReactJS", "NextJS", "TypeScript", "JavaScript", "Redux", "React Query", "HTML", "CSS", "Ant Design", "MUI", "Tailwind CSS", "Storybook"],
  },
  {
    category: "API & Back-End",
    description: "Server-side frameworks, data access, and APIs behind the interface.",
    tools: ["C#", ".NET", "EF", "Node.js", "Express.js", "Python", "Django", "REST APIs", "OAuth"],
  },
  {
    category: "Database",
    description: "Relational and hosted data stores used across product work.",
    tools: ["SQL Server", "PostgreSQL", "Supabase", "Turso"],
  },
  {
    category: "DevOps & Cloud",
    description: "Cloud, hosting, and infrastructure used to run and deliver systems.",
    tools: ["Apache", "IIS", "Azure", "Docker", "Nginx", "Load balancing", "Cloudflare", "Render", "Git", "GitHub Actions", "Kubernetes (fundamentals)"],
  },
  {
    category: "AI",
    description: "Model and agent tooling used in a plan, review, and test process.",
    tools: ["Cursor", "Codex", "OpenAI API", "Grok Build", "Cost-aware model selection"],
  },
  {
    category: "Testing & Automation",
    description: "End-to-end testing used to ship with confidence.",
    tools: ["Selenium", "Playwright"],
  },
  {
    category: "Other Tools & Integration",
    description: "Localization, messaging, maps, and shipping integrations.",
    tools: ["i18next (localization)", "SendGrid", "Google Maps API", "Canada Post API"],
  },
];

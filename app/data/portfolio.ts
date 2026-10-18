export const beyondProjects: {
  title: string;
  kind: string;
  logo?: string;
  summary: string;
  href: string;
  host: string;
  stack: string[];
  hosted: string;
  database?: string;
}[] = [
  {
    title: "SouthFraserHUB",
    kind: "Local directory",
    logo: "/southfraserhub-logo.svg",
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
    logo: "/webtools-logo.svg",
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
    logo: "/stlcraft-logo.svg",
    summary:
      "I wanted a quicker way to turn Font Awesome icons, text, and SVGs into print-ready STLs without opening a CAD app.",
    href: "https://stlcraft.ajhub.ca",
    host: "stlcraft.ajhub.ca",
    stack: ["Next.js", "TypeScript", "React", "Three.js", "Font Awesome"],
    hosted: "Cloudflare Workers",
  },
];

export const toolboxGroups = [
  {
    category: "UI / Front-End",
    description: "Client-side languages, frameworks, and UI libraries used to design and ship interfaces.",
    tools: ["TypeScript", "JavaScript", "ReactJS", "NextJS", "Redux", "React Query", "HTML", "CSS", "Ant Design", "MUI", "Tailwind CSS"],
  },
  {
    category: "API & Back-End",
    description: "Server-side frameworks, data access, and APIs behind the interface.",
    tools: ["Node.js", "Express.js", "Python", "Django", "C#", ".NET", "EF", "REST APIs"],
  },
  {
    category: "Database",
    description: "Relational and hosted data stores used across product work.",
    tools: ["SQL Server", "PostgreSQL", "Supabase", "Turso"],
  },
  {
    category: "DevOps & Cloud",
    description: "Cloud, hosting, and infrastructure used to run and deliver systems.",
    tools: ["Azure", "Docker", "Nginx", "Load balancing", "Cloudflare", "Render", "Git", "IIS", "Apache"],
  },
  {
    category: "AI",
    description: "Model and agent tooling used in a plan, review, and test process.",
    tools: ["Codex", "Cursor", "OpenAI API", "Grok Build", "Cost-aware model selection"],
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

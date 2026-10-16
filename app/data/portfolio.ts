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
];

export const toolboxGroups = [
  {
    category: "Interface engineering",
    description: "Accessible, responsive interfaces built to stay coherent as products grow.",
    tools: ["TypeScript", "React", "Next.js", "Redux", "Ant Design", "Material UI", "Tailwind CSS"],
  },
  {
    category: "Backend systems",
    description: "Reliable application logic, integrations, and APIs behind the interface.",
    tools: ["C#", ".NET", "Node.js", "Python", "Django", "REST APIs"],
  },
  {
    category: "Data & platform",
    description: "The data, cloud, and infrastructure foundations that keep products running.",
    tools: ["PostgreSQL", "SQL Server", "Azure", "AWS", "IIS"],
  },
  {
    category: "Quality & delivery",
    description: "Practical safeguards for shipping confidently and improving continuously.",
    tools: ["Playwright", "Selenium", "Azure DevOps", "CI/CD", "Accessibility"],
  },
  {
    category: "AI & product",
    description: "Tools and methods for exploring ideas, automating work, and finding the useful path.",
    tools: ["OpenAI API", "Codex", "Grok Build", "Cost-aware model selection", "AI tools", "Automation", "Prototyping", "Product thinking"],
  },
];

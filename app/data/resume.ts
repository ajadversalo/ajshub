/**
 * Résumé sheet copy. Keep category names aligned with the latest resume PDF.
 *
 * @packageDocumentation
 */

/** One employer block on `/resume`. */
export type ResumeRole = {
  company: string;
  role: string;
  period: string;
  summary: string;
  projects: [name: string, description: string][];
  stack: string[];
};

export const roles: ResumeRole[] = [
  {
    company: "Centra Construction Group",
    role: "Senior Software Developer · Langley, BC",
    period: "Jun 2023 — Present",
    summary: "Modernizing enterprise applications, digitizing operational workflows, and prototyping AI-driven planning tools across five Western Canadian branches.",
    projects: [
      ["CentraWorks", "Led the modernization of a company-wide platform for managing, scheduling and reporting on work orders across all departments into a modular Next.js/.NET client-server architecture, improving load performance by 50% across five Western Canada branches."],
      ["CentraManufacture", "A mobile-first digital operations tracker that digitized shop-floor workflows and reduced manual logging time by 40% in Langley and Calgary facilities."],
      ["Text-to-SQL", "LLM-powered natural-language querying of operational data using the OpenAI API."],
    ],
    stack: ["Next.js", "TypeScript", "C#", ".NET", "Redux", "Ant Design", "Playwright", "OpenAI API", "Cursor", "Grok Build"],
  },
  {
    company: "GenXys Healthcare Systems",
    role: "Full-Stack Developer · Vancouver, BC",
    period: "Jul 2019 — Jun 2023",
    summary: "Modernized clinical SaaS products, created shared UI foundations, and automated fulfillment and communication workflows across the GenXys suite.",
    projects: [
      ["TreatGx", "Helped transition the flagship prescribing platform into modular React applications."],
      ["Product suite foundations", "Reusable components, user management, reporting, notifications, and shipping automation."],
      ["Canada Post integration", "Automated test kit shipping through the Canada Post API, cutting manual data entry by 80%."],
    ],
    stack: ["React", "Redux", "C#", ".NET", "Azure DevOps", "Material UI", "SendGrid", "Selenium"],
  },
  {
    company: "Earlier Technical Career",
    role: "Application & Systems Administration",
    period: "2010 — 2018",
    summary: "Provided desktop, network, application, and server support across renewable energy, oil and gas, and manufacturing organizations.",
    projects: [["IT operations", "Handled system, network and application administration across multi-site environments, and wrote automation scripts to streamline routine operations."]],
    stack: ["Desktop Support", "Networking", "Application Support", "Server Support", "Systems Administration", "Windows", "Active Directory", "Mail Server"],
  },
];

/** Capability row: category label plus comma-separated tools. */
export type ResumeSkillGroup = [category: string, items: string];

export const skills: ResumeSkillGroup[] = [
  ["UI / Front-End", "ReactJS, NextJS, TypeScript, JavaScript, Redux, React Query, HTML, CSS, Ant Design, MUI, Tailwind CSS, Storybook"],
  ["API & Back-End", "C#, .NET, EF, Node.js, Express.js, Python, Django, REST APIs, OAuth"],
  ["Database", "SQL Server, PostgreSQL, Supabase, Turso"],
  ["DevOps & Cloud", "Apache, IIS, Azure, Docker, Nginx, Load balancing, Cloudflare, Render, Git, GitHub Actions, Kubernetes (fundamentals)"],
  ["AI", "Cursor, Codex, OpenAI API, Grok Build | Cost-aware model selection"],
  ["Testing & Automation", "Selenium, Playwright"],
  ["Other Tools & Integration", "i18next (localization), SendGrid, Google Maps API, Canada Post API"],
];
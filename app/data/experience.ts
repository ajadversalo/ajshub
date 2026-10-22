/**
 * Homepage experience chapters and the shared tech-icon lookup.
 *
 * @packageDocumentation
 */

import { IMAGES, techIconSrc } from "../constants";

/** One shipped product inside an experience chapter. */
export type ProductRecord = {
  name: string;
  type: string;
  note: string;
  tags: string[];
};

/** Employer or earlier-career chapter on the homepage. */
export type ExperienceChapter = {
  company: string;
  logo?: string;
  website?: string;
  discipline: string;
  marker: string;
  intro: string;
  stack: string[];
  products: ProductRecord[];
};

export const experience: ExperienceChapter[] = [
  {
    company: "Centra Construction Group",
    logo: IMAGES.centraLogo,
    website: "https://www.centrawindows.com",
    discipline: "Senior Software Developer · Langley, BC",
    marker: "June 2023 — Present",
    intro: "Modernizing enterprise applications, digitizing shop-floor workflows, and exploring AI-driven planning across five Western Canadian branches.",
    stack: ["Next.js", "TypeScript", "C#", ".NET", "Redux", "Ant Design", "Playwright", "OpenAI API", "Cursor", "Grok Build"],
    products: [
      { name: "CentraWorks", type: "Work order platform", note: "A company-wide platform for managing, scheduling and reporting on work orders across all departments. I led its modernization into a modular Next.js/.NET client-server architecture, improving load performance by 50% across five Western Canada branches.", tags: ["Work orders", "Scheduling", "Reporting", "Cross-department"] },
      { name: "CentraManufacture", type: "Manufacturing platform", note: "A production application that surfaces live manufacturing insights, supports workflow optimization, and helps teams identify bottlenecks while maintaining quality control.", tags: ["Manufacturing", "Live insights", "Workflow optimization", "Mobile-first"] },
      { name: "CentraMetrics", type: "Performance dashboard", note: "A centralized dashboard for operational metrics across production, scheduling, and service, giving teams clearer data for day-to-day decisions.", tags: ["Analytics", "Data visualization", "Operational metrics"] },
      { name: "CentraService", type: "Service management", note: "A post-installation workflow system for logging, scheduling, and resolving repairs, warranty claims, and ongoing maintenance requests.", tags: ["Service workflows", "Warranty claims", "Scheduling"] },
      { name: "CentraRequest", type: "Internal operations", note: "A centralized platform for internal requests including share purchases, vacation forms, employee onboarding, and terminations.", tags: ["Request management", "Administration", "Workflow automation"] },
      { name: "CentraCustomers", type: "Customer management", note: "A CRM system that maintains client records and interactions, providing teams across branches with a unified view of customer data.", tags: ["CRM", "Customer data", "Multi-branch"] },
      { name: "CentraAccess", type: "Access management", note: "An internal permissions tool that manages user roles and security levels across Centra applications to support consistent authorization and data protection.", tags: ["Authorization", "User roles", "Security"] },
      { name: "CentraWindows.com", type: "Company website", note: "Centra’s primary marketing and customer engagement website, combining product information and lead generation with backend quoting and service-request integrations.", tags: ["Marketing", "Lead generation", "Systems integration"] },
    ],
  },
  {
    company: "GenXys Healthcare Systems",
    logo: IMAGES.genxysLogo,
    website: "https://genxys.com",
    discipline: "Full-Stack Developer · Vancouver, BC",
    marker: "July 2019 — June 2023",
    intro: "Modernized clinical SaaS products, built reusable UI foundations, and automated operational workflows across the GenXys product suite.",
    stack: ["React", "Redux", "C#", ".NET", "Azure DevOps", "Material UI", "SendGrid", "Selenium"],
    products: [
      { name: "GenXys Portal", type: "Provider portal", note: "The Canadian and United States portal where healthcare providers purchase licenses and manage their accounts and preferences.", tags: ["Healthcare SaaS", "Licensing", "Account management"] },
      { name: "TreatGx", type: "Precision prescribing", note: "A clinical decision-support product that combines a patient’s genetics, current clinical evidence, and entered health information to generate safer, more effective medication options.", tags: ["Pharmacogenetics", "Clinical evidence", "Decision support"] },
      { name: "ReviewGx", type: "Medication review", note: "A medication therapy management tool that brings together evidence-based pharmacogenomics, deprescribing insights, and clinical laboratory data for comprehensive reviews.", tags: ["Medication therapy", "Pharmacogenomics", "Clinical data"] },
      { name: "Alogogen", type: "Algorithm authoring", note: "An internal application used by algorithm developers to create and maintain complex pharmacogenetic algorithms.", tags: ["Internal tools", "Algorithms", "Pharmacogenetics"] },
      { name: "TrackGx", type: "Patient tracking", note: "A mobile-first application that helps patients monitor and report the efficacy of their prescriptions over time.", tags: ["Mobile-first", "Patient experience", "Medication tracking"] },
      { name: "LabGx", type: "Laboratory platform", note: "A laboratory application that supports uploading and processing genetic data from lab results.", tags: ["Laboratory workflows", "Genetic data", "Data processing"] },
      { name: "Patient Dashboard", type: "Patient portal", note: "A patient-facing portal for securely viewing laboratory reports and medication reviews in one place.", tags: ["Patient portal", "Lab reports", "Medication reviews"] },
    ],
  },
  {
    company: "Earlier Technical Career",
    discipline: "Application & Systems Administration",
    marker: "2010 — 2018",
    intro: "Supported users, applications, and infrastructure across renewable energy, oil and gas, and manufacturing environments.",
    stack: ["Desktop Support", "Networking", "Application Support", "Server Support", "Systems Administration", "Windows", "Active Directory", "Mail Server"],
    products: [
      { name: "Technical support & systems administration", type: "IT operations", note: "Handled system, network and application administration across multi-site environments, and wrote automation scripts to streamline routine operations.", tags: ["Desktop support", "Network support", "Application support", "Server support"] },
    ],
  },
];

/** SVG asset used by the TechIcon component. */
export type TechIconSpec = {
  src: string;
  /** Invert in dark theme so black Simple Icons read as paper. */
  invert?: boolean;
};

const icon = (file: string, invert?: true): TechIconSpec =>
  invert ? { src: techIconSrc(file), invert } : { src: techIconSrc(file) };

export const techIcons: Record<string, TechIconSpec> = {
  "Next.js": icon("nextdotjs.svg", true),
  NextJS: icon("nextdotjs.svg", true),
  TypeScript: icon("typescript.svg"),
  JavaScript: icon("javascript.svg"),
  "C#": icon("csharp.svg"),
  ".NET": icon("dotnet.svg"),
  EF: icon("dotnet.svg"),
  Redux: icon("redux.svg"),
  "Ant Design": icon("antdesign.svg"),
  Playwright: icon("playwright.svg"),
  "OpenAI API": icon("openai.svg"),
  React: icon("react.svg"),
  ReactJS: icon("react.svg"),
  "React Query": icon("reactquery.svg"),
  HTML: icon("html5.svg"),
  CSS: icon("css.svg"),
  "Azure DevOps": icon("azuredevops.svg"),
  "Material UI": icon("mui.svg"),
  MUI: icon("mui.svg"),
  SendGrid: icon("sendgrid.svg"),
  "Express.js": icon("express.svg", true),
  Docker: icon("docker.svg"),
  Nginx: icon("nginx.svg"),
  "Load balancing": icon("load-balancing.svg"),
  Render: icon("render.svg", true),
  Git: icon("git.svg"),
  Apache: icon("apache.svg"),
  Cursor: icon("cursor.svg", true),
  Supabase: icon("supabase.svg"),
  Turso: icon("turso.svg"),
  "i18next (localization)": icon("i18next.svg"),
  "Google Maps API": icon("googlemaps.svg"),
  "Canada Post API": icon("canada-post.svg"),
  Selenium: icon("selenium.svg"),
  "Tailwind CSS": icon("tailwindcss.svg"),
  "Node.js": icon("nodedotjs.svg"),
  Python: icon("python.svg"),
  Django: icon("django.svg"),
  PostgreSQL: icon("postgresql.svg"),
  "SQL Server": icon("microsoftsqlserver.svg"),
  Azure: icon("azure.svg"),
  AWS: icon("aws.svg"),
  IIS: icon("iis.svg"),
  "REST APIs": icon("swagger.svg"),
  "CI/CD": icon("githubactions.svg"),
  "GitHub Actions": icon("githubactions.svg"),
  Accessibility: icon("accessibility.svg"),
  Codex: icon("codex.svg"),
  "Grok Build": icon("grok-build.svg"),
  "Cost-aware model selection": icon("cost-aware.svg"),
  "AI tools": icon("ai-tools.svg"),
  Automation: icon("automation.svg"),
  Prototyping: icon("figma.svg"),
  "Product thinking": icon("product-thinking.svg"),
  Cloudflare: icon("cloudflare.svg"),
  "Cloudflare Workers": icon("cloudflareworkers.svg"),
  Leaflet: icon("leaflet.svg"),
  SQLite: icon("sqlite.svg"),
  "Cloudflare D1": icon("sqlite.svg"),
  "Three.js": icon("threedotjs.svg", true),
  "Font Awesome": icon("fontawesome.svg"),
};

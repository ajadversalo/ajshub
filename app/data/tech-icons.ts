/**
 * Skill name → SVG used by {@link TechIcon}.
 *
 * Names must match toolbox, experience, and Beyond Work strings exactly.
 *
 * @packageDocumentation
 */

import { techIconSrc } from "../constants";

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
  IIS: icon("iis.svg"),
  "REST APIs": icon("swagger.svg"),
  "GitHub Actions": icon("githubactions.svg"),
  Codex: icon("codex.svg"),
  "Grok Build": icon("grok-build.svg"),
  "Cost-aware model selection": icon("cost-aware.svg"),
  Cloudflare: icon("cloudflare.svg"),
  "Cloudflare Workers": icon("cloudflareworkers.svg"),
  Leaflet: icon("leaflet.svg"),
  SQLite: icon("sqlite.svg"),
  "Cloudflare D1": icon("sqlite.svg"),
  "Three.js": icon("threedotjs.svg", true),
  "Font Awesome": icon("fontawesome.svg"),
};

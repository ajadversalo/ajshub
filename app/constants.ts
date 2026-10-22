/**
 * Site-wide identity, routes, theme keys, metadata, and UI copy.
 *
 * Job history, side projects, and resume content live in `app/data/`.
 *
 * @packageDocumentation
 */

/** Canonical production origin. Used by Next metadata; keep icon hrefs relative. */
export const SITE_URL = "https://builtbyaj.dev";
export const SITE_NAME = "Built by AJ";
export const PERSON_NAME = "AJ Adversalo";
export const PERSON_SHORT = "AJ";
export const ROLE = "Full-stack developer";
export const LOCATION = "Vancouver, BC";
export const ROLE_LINE = `${ROLE} · ${LOCATION}`;
export const EMAIL = "ajadvers@gmail.com";
export const MAILTO = `mailto:${EMAIL}`;
export const GITHUB_URL = "https://github.com/ajadversalo";
export const LINKEDIN_URL = "https://www.linkedin.com/in/ajadversalo";
export const AI_JABBER_URL = "https://aijabber.ca";

/** `localStorage` key written by {@link ThemeToggle} and the layout FOUC script. */
export const THEME_STORAGE_KEY = "theme";
export type Theme = "light" | "dark";
/** Fallback when storage is missing or invalid. Matches `html data-theme`. */
export const DEFAULT_THEME: Theme = "light";

/** Query string on favicon links so browsers pick up a new mark. */
export const FAVICON_VERSION = "aj";

/**
 * Public image roots. Favicons stay at `/` because browsers request `/favicon.ico`.
 */
export const ASSETS = {
  brand: "/images/brand",
  companies: "/images/companies",
  projects: "/images/projects",
  tech: "/images/tech",
} as const;

export const IMAGES = {
  og: `${ASSETS.brand}/og.png`,
  centraLogo: `${ASSETS.companies}/centra-logo.png`,
  genxysLogo: `${ASSETS.companies}/genxys-logo-square.png`,
  southfraserhubLogo: `${ASSETS.projects}/southfraserhub-logo.svg`,
  webtoolsLogo: `${ASSETS.projects}/webtools-logo.svg`,
  stlcraftLogo: `${ASSETS.projects}/stlcraft-logo.svg`,
} as const;

/** Skill SVG under `public/images/tech`. */
export function techIconSrc(file: string) {
  return `${ASSETS.tech}/${file}`;
}

export const ROUTES = {
  home: "/",
  beyondWork: "/beyond-work",
  resume: "/resume",
} as const;

export const SECTIONS = {
  top: "top",
  toolbox: "toolbox",
  experience: "experience-archive",
} as const;

export const HASH = {
  top: `#${SECTIONS.top}`,
  toolbox: `#${SECTIONS.toolbox}`,
  experience: `#${SECTIONS.experience}`,
} as const;

export const NAV = {
  homeLabel: `${PERSON_NAME}, home`,
  tools: "Tools",
  experience: "Experience",
  beyondWork: "Beyond Work",
} as const;

export const METADATA = {
  title: `${PERSON_NAME} — Full-Stack Developer`,
  description: `${PERSON_NAME} is a product-minded full-stack developer building useful, thoughtful digital experiences.`,
  ogDescription: "I build digital things that work.",
  ogImage: IMAGES.og,
  ogImageAlt: `${PERSON_NAME} — I build digital things that work.`,
  beyondWorkTitle: `Beyond Work — ${PERSON_NAME}`,
  beyondWorkDescription: `Side projects and after-hours work by ${PERSON_NAME}.`,
} as const;

export const COPY = {
  heroKicker: "Hello I’m",
  heroBio:
    "I’m a product-minded full-stack developer in Vancouver, BC. I bring useful products from idea to production, with AI integrated into a careful process of iterating, building, and shipping.",
  explore: "Explore",
  contact: "Contact",
  toolboxHeading: "My Technical Toolkit",
  toolboxSub: "The technologies I use to design, build, and ship products.",
  toolboxFilterLabel: "Find a technology",
  toolboxPlaceholder: "Try ReactJS, Python, Azure…",
  toolboxClear: "Clear technology filter",
  toolboxEmpty: "No matching technologies. Try a broader search.",
  experienceHeading: "What I helped bring to life",
  experienceIntro:
    "Some project details are intentionally kept high-level to respect the confidential nature of the work.",
  beyondHeading: "Beyond Work",
  beyondIntro: "Things I tinker with outside the day job.",
  resumeSummary:
    "Full-stack developer focused on designing reliable, high-performance systems that improve efficiency and scale across teams. Experienced in modernizing enterprise applications, automating workflows, and integrating agentic AI into a disciplined plan, review and test process.",
  resumeExport: "Export PDF ↗",
  resumeExperienceLabel: "Experience / 01",
  resumeCapabilitiesLabel: "Capabilities / 02",
  resumeFooterNote: "Built with intent.",
} as const;

/** Inline head script that applies the saved theme before first paint. */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t='${DEFAULT_THEME}';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='${DEFAULT_THEME}';document.documentElement.style.colorScheme='${DEFAULT_THEME}'}})()`;

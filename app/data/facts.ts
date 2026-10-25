/**
 * Computed career facts for Ask.
 *
 * Source data stays in resume, experience, and side-project files.
 * This module does the arithmetic at request time so questions like
 * “how many years as a developer” (GenXys through now) or
 * “how many side projects” are calculated, not copied from a stale table.
 *
 * @packageDocumentation
 */

import { PERSON_NAME, ROLE, LOCATION } from "../constants";
import { experience } from "./experience";
import { beyondProjects } from "./portfolio";
import { roles, yearsSince } from "./resume";
import { EMPLOYER_TENURE, isProjectsQuestion, isYearsQuestion, type TenureSpan } from "./tech-index";

export const FACTS_ID = "facts";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fold(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function monthIndex(year: number, month: number) {
  return year * 12 + (month - 1);
}

function labelMonth(year: number, month: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}

function mentioned(haystack: string, needle: string) {
  const alias = fold(needle);
  if (alias.length < 2) return false;
  const text = fold(haystack);
  if (alias.length <= 3) {
    return text.split(/[^a-z0-9+#./]+/).includes(alias);
  }
  return text.includes(alias);
}

function spanForRole(company: string, period: string): TenureSpan | null {
  const tenure = EMPLOYER_TENURE[company];
  if (!tenure) return null;
  return { ...tenure, label: period };
}

/** Inclusive months covered by a span, ending at `now` when the role is current. */
export function monthsInSpan(span: TenureSpan, now = new Date()) {
  const start = monthIndex(span.start.year, span.start.month);
  const end = span.end
    ? monthIndex(span.end.year, span.end.month)
    : monthIndex(now.getFullYear(), now.getMonth() + 1);
  return Math.max(0, end - start + 1);
}

/**
 * Whole years covered by dated roles.
 * Ongoing work uses the same clock as the résumé (`yearsSince` from the earliest start).
 * That is how “years as a developer” becomes GenXys (July 2019) through today at Centra.
 */
export function yearsFromSpans(spans: TenureSpan[], now = new Date()) {
  if (spans.length === 0) return 0;

  let earliest = spans[0].start;
  let earliestKey = monthIndex(earliest.year, earliest.month);
  let latestEnd = spans[0].end ?? null;
  let latestKey = latestEnd ? monthIndex(latestEnd.year, latestEnd.month) : -1;
  let ongoing = false;

  for (const span of spans) {
    const startKey = monthIndex(span.start.year, span.start.month);
    if (startKey < earliestKey) {
      earliest = span.start;
      earliestKey = startKey;
    }
    if (!span.end) {
      ongoing = true;
      continue;
    }
    const endKey = monthIndex(span.end.year, span.end.month);
    if (!latestEnd || endKey > latestKey) {
      latestEnd = span.end;
      latestKey = endKey;
    }
  }

  if (ongoing) return yearsSince(earliest.year, earliest.month, now);
  if (!latestEnd) return 0;
  return yearsSince(earliest.year, earliest.month, new Date(latestEnd.year, latestEnd.month, 1));
}

function isDeveloperRole(role: string) {
  return /developer|software engineer|full[ -]?stack/i.test(role);
}

export type EmployerFact = {
  company: string;
  role: string;
  period: string;
  years: number;
  ongoing: boolean;
  developer: boolean;
};

export type FactSnapshot = {
  asOf: string;
  yearsAsDeveloper: number;
  yearsInTech: number;
  developerSince: string;
  technicalSince: string;
  currentEmployer: string;
  currentRole: string;
  yearsAtCurrent: number;
  employers: EmployerFact[];
  softwareEmployers: EmployerFact[];
  sideProjects: string[];
  sideProjectCount: number;
  workProducts: { company: string; names: string[] }[];
  workProductCount: number;
};

function employerFacts(now: Date): EmployerFact[] {
  return roles.map((role) => {
    const span = spanForRole(role.company, role.period);
    const ongoing = Boolean(span && !span.end);
    return {
      company: role.company,
      role: role.role,
      period: role.period,
      years: span ? yearsFromSpans([span], now) : 0,
      ongoing,
      developer: isDeveloperRole(role.role),
    };
  });
}

/** Live numbers derived from dated roles, products, and side projects. */
export function factSnapshot(now = new Date()): FactSnapshot {
  const employers = employerFacts(now);
  const softwareEmployers = employers.filter((row) => row.developer);
  const developerSpans = roles
    .filter((role) => isDeveloperRole(role.role))
    .map((role) => spanForRole(role.company, role.period))
    .filter((span): span is TenureSpan => Boolean(span));
  const techSpans = roles
    .map((role) => spanForRole(role.company, role.period))
    .filter((span): span is TenureSpan => Boolean(span));

  const earliestDev = developerSpans.reduce((best, span) => {
    if (!best) return span.start;
    return monthIndex(span.start.year, span.start.month) < monthIndex(best.year, best.month)
      ? span.start
      : best;
  }, developerSpans[0]?.start);

  const earliestTech = techSpans.reduce((best, span) => {
    if (!best) return span.start;
    return monthIndex(span.start.year, span.start.month) < monthIndex(best.year, best.month)
      ? span.start
      : best;
  }, techSpans[0]?.start);

  const current = employers.find((row) => row.ongoing) ?? employers[0];
  const workProducts = experience
    .filter((chapter) => isDeveloperRole(chapter.discipline))
    .map((chapter) => ({
      company: chapter.company,
      names: chapter.products.map((product) => product.name),
    }));

  return {
    asOf: now.toISOString().slice(0, 10),
    yearsAsDeveloper: yearsFromSpans(developerSpans, now),
    yearsInTech: yearsFromSpans(techSpans, now),
    developerSince: earliestDev ? labelMonth(earliestDev.year, earliestDev.month) : "",
    technicalSince: earliestTech ? String(earliestTech.year) : "",
    currentEmployer: current?.company ?? "",
    currentRole: current?.role ?? "",
    yearsAtCurrent: current?.years ?? 0,
    employers,
    softwareEmployers,
    sideProjects: beyondProjects.map((project) => project.title),
    sideProjectCount: beyondProjects.length,
    workProducts,
    workProductCount: workProducts.reduce((sum, row) => sum + row.names.length, 0),
  };
}

function yearsPhrase(count: number) {
  return count === 1 ? "1 year" : `${count} years`;
}

function countPhrase(count: number, unit: string) {
  if (count === 1 && unit.endsWith("s")) return `1 ${unit.slice(0, -1)}`;
  return `${count} ${unit}`;
}

/** Compact brief of live numbers for the corpus and for Gemini to calculate from. */
export function factsPassage(now = new Date()) {
  const snap = factSnapshot(now);
  const employerLines = snap.employers
    .map((row) => {
      const status = row.ongoing ? "ongoing" : "ended";
      const kind = row.developer ? "software developer" : "technical";
      return `${row.company}: ${row.role.split("·")[0]?.trim()} | ${row.period} | ${yearsPhrase(row.years)} (${status}, ${kind})`;
    })
    .join("\n");
  const productLines = snap.workProducts
    .map((row) => `${row.company} (${row.names.length}): ${row.names.join(", ")}`)
    .join("\n");

  return [
    `Computed career facts for ${PERSON_NAME} as of ${snap.asOf}. Recalculate from the dates; do not invent numbers.`,
    `${PERSON_NAME} is a ${ROLE} in ${LOCATION}.`,
    `Software-developer years: ${yearsPhrase(snap.yearsAsDeveloper)} since ${snap.developerSince}.`,
    "That total is the union of full-stack / software-developer roles: GenXys Healthcare Systems through the current Centra Construction Group role.",
    `Technical-career years (including systems administration from ${snap.technicalSince}): ${yearsPhrase(snap.yearsInTech)}.`,
    `Current role: ${snap.currentRole} at ${snap.currentEmployer} for ${yearsPhrase(snap.yearsAtCurrent)}.`,
    `Employers (${snap.employers.length}):`,
    employerLines,
    `Software employers (${snap.softwareEmployers.length}): ${snap.softwareEmployers.map((row) => row.company).join("; ")}.`,
    `Side projects (${snap.sideProjectCount}): ${snap.sideProjects.join(", ")}.`,
    `Work products (${snap.workProductCount}):`,
    productLines,
  ].join("\n");
}

type Metric = {
  id: string;
  value: number;
  answer: string;
  aliases: string[];
};

function metrics(snap: FactSnapshot): Metric[] {
  const employerMetrics = snap.employers.map((row) => ({
    id: `employer-${row.company}`,
    value: row.years,
    answer: yearsPhrase(row.years),
    aliases: [row.company, row.company.split(/\s+/)[0] ?? row.company],
  }));

  const productMetrics = snap.workProducts.map((row) => ({
    id: `products-${row.company}`,
    value: row.names.length,
    answer: `${countPhrase(row.names.length, "products")}: ${row.names.join(", ")}`,
    aliases: [`${row.company.split(/\s+/)[0]} products`, `products at ${row.company.split(/\s+/)[0]}`],
  }));

  return [
    {
      id: "developer-years",
      value: snap.yearsAsDeveloper,
      answer: yearsPhrase(snap.yearsAsDeveloper),
      aliases: [
        "developer",
        "software developer",
        "full stack",
        "full-stack",
        "coding",
        "programmer",
        "dev",
        "software engineer",
        "software development",
        "as a developer",
        "been a developer",
        "been a dev",
        "years of experience",
      ],
    },
    {
      id: "tech-years",
      value: snap.yearsInTech,
      answer: yearsPhrase(snap.yearsInTech),
      aliases: ["technical career", "in tech", "in it", "it career", "systems administration"],
    },
    {
      id: "current-years",
      value: snap.yearsAtCurrent,
      answer: yearsPhrase(snap.yearsAtCurrent),
      aliases: ["current job", "current role", "current employer", "present job", "this job"],
    },
    {
      id: "side-projects",
      value: snap.sideProjectCount,
      answer: `${countPhrase(snap.sideProjectCount, "side projects")}: ${snap.sideProjects.join(", ")}`,
      aliases: ["side project", "side projects", "personal project", "personal projects", "beyond work"],
    },
    {
      id: "employers",
      value: snap.softwareEmployers.length,
      answer: `${countPhrase(snap.softwareEmployers.length, "software employers")}: ${snap.softwareEmployers.map((row) => row.company).join(", ")}`,
      aliases: ["employers", "companies", "places you have worked", "places you've worked"],
    },
    {
      id: "work-products",
      value: snap.workProductCount,
      answer: `${countPhrase(snap.workProductCount, "work products")} and ${countPhrase(snap.sideProjectCount, "side projects")}`,
      aliases: ["work products", "products you built", "things you built"],
    },
    ...employerMetrics,
    ...productMetrics,
  ];
}

function longestAliasHit(metric: Metric, question: string) {
  let best = 0;
  for (const alias of metric.aliases) {
    if (mentioned(question, alias)) best = Math.max(best, fold(alias).length);
  }
  return best;
}

function pickMetrics(question: string, snap: FactSnapshot) {
  return metrics(snap)
    .map((metric) => ({ metric, hit: longestAliasHit(metric, question) }))
    .filter((row) => row.hit > 0)
    .sort((a, b) => b.hit - a.hit)
    .map((row) => row.metric);
}

function compareToNumber(question: string, value: number) {
  const match = fold(question).match(
    /\b(more than|over|greater than|at least|less than|under|fewer than|exactly)\s+(\d+)\b/,
  );
  if (!match) return null;
  const amount = Number(match[2]);
  const op = match[1];
  let pass = false;
  if (op === "more than" || op === "over" || op === "greater than") pass = value > amount;
  else if (op === "at least") pass = value >= amount;
  else if (op === "less than" || op === "under" || op === "fewer than") pass = value < amount;
  else pass = value === amount;
  return pass ? "Yes" : "No";
}

function looksLikeCount(question: string) {
  return /\b(how many|number of|count of|how much)\b/i.test(question);
}

function defaultCareerYears(question: string) {
  return isYearsQuestion(question)
    && /\b(experience|career|working|worked|been)\b/i.test(question)
    && !/\b(react|next|\.net|c#|python|node|sql|cloudflare|typescript|javascript)\b/i.test(question);
}

/**
 * Calculate an answer from live facts.
 * Returns null when the question is not a tenure, count, or comparison the brain can evaluate.
 */
export function think(question: string, now = new Date()): string | null {
  const snap = factSnapshot(now);
  let matched = pickMetrics(question, snap);

  if (matched.length === 0 && defaultCareerYears(question)) {
    matched = metrics(snap).filter((metric) => metric.id === "developer-years");
  }

  if (matched.length === 0) {
    if (looksLikeCount(question) && isProjectsQuestion(question)) {
      matched = metrics(snap).filter((metric) => metric.id === "side-projects");
    }
  }

  if (matched.length === 0) return null;

  const wantYears = isYearsQuestion(question);
  const wantCount = looksLikeCount(question);
  const wantCompare = matched.some((metric) => compareToNumber(question, metric.value));
  const wantSideList = matched.some((metric) => metric.id === "side-projects")
    && /\b(what|which|list|name)\b/i.test(question);
  if (!wantYears && !wantCount && !wantCompare && !wantSideList) return null;

  const developerHit = matched.find((metric) => metric.id === "developer-years");
  const employerHits = matched.filter((metric) => metric.id.startsWith("employer-"));
  const combined = /\b(including|across|combined|in total|till now|until now|to now|since genxys|through now|until today)\b/i.test(question);
  if (wantYears && developerHit && (combined || employerHits.length === 0 || !/\bat\b/i.test(question))) {
    matched = [developerHit];
  } else if (wantYears && employerHits.length > 0 && /\bat\b/i.test(question) && !combined) {
    matched = [employerHits[0]];
  } else if (matched.length > 1) {
    matched = [matched[0]];
  }

  const lines = matched.map((metric) => {
    const compared = compareToNumber(question, metric.value);
    return compared ? `${compared}. ${metric.answer}` : metric.answer;
  });
  return [...new Set(lines)].join("\n");
}

export function isFactQuestion(question: string, now = new Date()) {
  if (think(question, now)) return true;
  return /\b(how many|how long|side projects?|been a dev|years as a (?:dev|developer)|more than|less than|till now|until now)\b/i.test(question);
}

/** Matches the whole-year clock used on the résumé for an ongoing start date. */
export function yearsAsDeveloper(now = new Date()) {
  return factSnapshot(now).yearsAsDeveloper;
}

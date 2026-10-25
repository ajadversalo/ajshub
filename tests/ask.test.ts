import assert from "node:assert/strict";
import test from "node:test";
import { corpus } from "../app/data/corpus.ts";
import { factSnapshot, think, yearsFromSpans } from "../app/data/facts.ts";
import { beyondProjects } from "../app/data/portfolio.ts";
import { yearsSince } from "../app/data/resume.ts";
import { buildTechRecords, EMPLOYER_TENURE } from "../app/data/tech-index.ts";
import { handleAsk } from "../worker/ask.ts";
import { ask, askStatus, inspectVectors, NEED_SITE_CONTEXT } from "../worker/rag.ts";

test("corpus covers the site copy", () => {
  assert.ok(corpus.length > 10);
  assert.ok(corpus.some((chunk) => chunk.id === "profile"));
  assert.ok(corpus.some((chunk) => chunk.id === "summary"));
  assert.ok(corpus.some((chunk) => chunk.id.includes("centra")));
  assert.ok(corpus.some((chunk) => chunk.id === "tech-list"));
  assert.ok(corpus.some((chunk) => chunk.id === "tech-list-undated"));
  assert.ok(corpus.some((chunk) => chunk.id === "facts"));
  const list = corpus.find((chunk) => chunk.id === "tech-list");
  assert.match(list?.text ?? "", /React \| \d+ years since July 2019 \|/);
  assert.match(list?.text ?? "", /C# and \.NET \| \d+ years/);
});

test("status reports corpus size without bindings", () => {
  const info = askStatus({});
  assert.equal(info.chunks, corpus.length);
  assert.equal(info.vectorize, false);
  assert.equal(info.embeddings, false);
});

test("vector inspector lists the corpus when Vectorize is unbound", async () => {
  const report = await inspectVectors({});
  assert.equal(report.corpusCount, corpus.length);
  assert.equal(report.inIndexCount, 0);
  assert.equal(report.chunks.length, corpus.length);
  assert.ok(report.chunks.every((chunk) => chunk.inIndex === false && chunk.text.length > 0));
  assert.deepEqual(report.orphans, []);
  assert.match(report.indexError ?? "", /VECTORIZE binding missing/);
});

test("tech index dates React from 2019 and Next.js from 2023", () => {
  const now = new Date("2026-10-25");
  const records = buildTechRecords(now);
  const react = records.find((record) => record.id === "react");
  const next = records.find((record) => record.id === "nextjs");
  const javascript = records.find((record) => record.id === "javascript");
  const leaflet = records.find((record) => record.id === "leaflet");
  assert.equal(react?.years, 7);
  assert.equal(react?.years, yearsSince(2019, 7, now));
  assert.equal(next?.years, yearsSince(2023, 6, now));
  assert.equal(javascript?.years, yearsSince(2019, 7, now));
  assert.equal(leaflet?.years, null);
  assert.ok(next?.projects.some((project) => /CentraWorks/i.test(project.name)));
  assert.ok(next?.projects.some((project) => /SouthFraserHUB/i.test(project.name)));
});

test("a Unix-epoch clock reports 0 React years, which must not be used at Worker import", () => {
  const epoch = new Date(0);
  const react = buildTechRecords(epoch).find((record) => record.id === "react");
  assert.equal(react?.years, 0);
  assert.equal(react?.sinceLabel, "July 2019");
});

test("lexical retrieval answers Centra questions from the corpus", async () => {
  const payload = await ask({}, "What did you build at Centra?");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /CentraWorks|CentraManufacture/i);
  assert.ok(payload.sources.length > 0);
});

test("lexical retrieval answers how many years of a specific tech", async () => {
  const dotnet = await ask({}, "how many years do you have working on .net");
  const dotnetYears = yearsSince(2019, 7);
  assert.equal(dotnet.retrieval, "lexical");
  assert.equal(dotnet.answer, `${dotnetYears} years`);
  assert.doesNotMatch(dotnet.answer, /CentraWorks|since /);
  assert.ok(dotnet.sources.some((source) => source.id === "tech-list"));

  const react = await ask({}, "How many years have you worked with React?");
  const reactYears = yearsSince(2019, 7);
  assert.equal(react.retrieval, "lexical");
  assert.equal(react.answer, `${reactYears} years`);
  assert.doesNotMatch(react.answer, /React \||CentraWorks|SouthFraserHUB|since July/);
  assert.ok(react.sources.some((source) => source.id === "tech-list"));
  assert.ok(react.sources.every((source) => source.id !== "tech-list-undated"));

  const short = await ask({}, "years of React");
  assert.equal(short.answer, `${reactYears} years`);
  assert.doesNotMatch(short.answer, /CentraWorks|GenXys|SouthFraserHUB|WebTools|STLCraft/);
});

test("lexical retrieval lists projects built with a tech", async () => {
  const next = await ask({}, "What projects have you built with Next.js?");
  assert.equal(next.retrieval, "lexical");
  assert.match(next.answer, /CentraWorks/i);
  assert.match(next.answer, /SouthFraserHUB/i);
  assert.doesNotMatch(next.answer, /years since/);
  assert.ok(next.sources.some((source) => source.id === "tech-list"));

  const listed = await ask({}, "List projects with .NET");
  assert.equal(listed.retrieval, "lexical");
  assert.match(listed.answer, /CentraWorks/i);
  assert.match(listed.answer, /WebTools/i);
  assert.ok(listed.sources.some((source) => source.id === "tech-list"));
});

test("lexical retrieval says undated toolkit techs have no year count", async () => {
  const payload = await ask({}, "how many years do you have working on Python");
  assert.equal(payload.retrieval, "lexical");
  assert.equal(payload.answer, "years not stated");
  assert.ok(payload.sources.some((source) => source.id === "tech-list-undated"));
});

test("Cloudflare D1 answers the D1 row, not the generic Cloudflare toolkit row", async () => {
  const payload = await ask({}, "how many years working on Cloudflare D1");
  assert.equal(payload.answer, "years not stated");
  assert.doesNotMatch(payload.answer, /none listed|SouthFraserHUB/);
});

test("lexical retrieval summarizes profile info", async () => {
  const payload = await ask({}, "Summarize my info");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /Vancouver/i);
  assert.match(payload.answer, /Centra Construction Group/i);
  assert.match(payload.answer, /GenXys/i);
  assert.ok(payload.sources.some((source) => source.id === "summary"));
});

test("lexical retrieval answers the name without dumping unrelated chunks", async () => {
  const payload = await ask({}, "what is your name");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /AJ Adversalo/);
  assert.doesNotMatch(payload.answer, /Here is what the site has about/i);
  assert.doesNotMatch(payload.answer, /Font Awesome|Leaflet|Cloudflare D1/i);
  assert.ok(payload.sources.some((source) => source.id === "profile"));
  assert.ok(payload.sources.every((source) => source.id !== "site-rag"));
});

test("ask HTTP payload is the answer only", async () => {
  const response = await handleAsk(
    new Request("https://portfolio.ajhub.ca/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "How many years have you worked with React?" }),
    }),
    {},
  );
  const payload = await response.json() as Record<string, unknown>;
  assert.equal(response.status, 200);
  assert.equal(payload.answer, `${yearsSince(2019, 7)} years`);
  assert.equal(payload.sources, undefined);
  assert.equal(payload.retrieval, "lexical");
});

test("developer years are GenXys through now, not a frozen table cell", () => {
  const now = new Date("2026-10-25");
  const genxys = EMPLOYER_TENURE["GenXys Healthcare Systems"];
  const centra = EMPLOYER_TENURE["Centra Construction Group"];
  const snap = factSnapshot(now);
  const union = yearsFromSpans([
    { ...genxys, label: "GenXys" },
    { ...centra, label: "Centra" },
  ], now);

  assert.equal(snap.yearsAsDeveloper, yearsSince(2019, 7, now));
  assert.equal(snap.yearsAsDeveloper, union);
  assert.equal(snap.yearsAsDeveloper, 7);
  assert.equal(think("How many years have you been a developer?", now), "7 years");
  assert.equal(
    think("how many years as a dev counting genxys till now", now),
    "7 years",
  );
  assert.equal(think("How many years have you been a developer?", new Date(0)), "0 years");
});

test("side project count is calculated from the live list", () => {
  const now = new Date("2026-10-25");
  const snap = factSnapshot(now);
  assert.equal(snap.sideProjectCount, beyondProjects.length);
  assert.equal(snap.sideProjectCount, 3);
  assert.equal(
    think("How many side projects do you have?", now),
    "3 side projects: SouthFraserHUB, WebTools, STLCraft",
  );
  assert.match(think("Do you have more than 2 side projects?", now) ?? "", /^Yes\./);
  assert.match(think("Do you have more than 10 side projects?", now) ?? "", /^No\./);
});

test("Ask calculates developer years and side-project counts", async () => {
  const years = yearsSince(2019, 7);
  const developer = await ask({}, "How many years have you been a developer?");
  assert.equal(developer.answer, `${years} years`);
  assert.ok(developer.sources.some((source) => source.id === "facts"));

  const counted = await ask({}, "How many side projects do you have?");
  assert.equal(counted.answer, "3 side projects: SouthFraserHUB, WebTools, STLCraft");

  const compared = await ask({}, "Have you been a developer for more than 5 years?");
  assert.equal(compared.answer, `Yes. ${years} years`);
});

function geminiHttp(text: string) {
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  }), { headers: { "Content-Type": "application/json" } });
}

async function withFetch(handler: typeof fetch, run: () => Promise<void>) {
  const original = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
}

test("every message goes to Gemini first, including hi", async () => {
  await withFetch(async (input) => {
    assert.match(String(input), /generateContent/);
    return geminiHttp("Hi — I’m AJ. What would you like to know?");
  }, async () => {
    const result = await ask({ GEMINI_API_KEY: "test-key" }, "Hi");
    assert.equal(result.retrieval, "gemini");
    assert.match(result.answer, /Hi/);
    assert.equal(result.sources.length, 0);
    assert.doesNotMatch(result.answer, /I do not have that on this site yet/);
  });
});

test("RAG runs only after Gemini says it does not know", async () => {
  let generations = 0;
  await withFetch(async (input) => {
    const url = String(input);
    if (url.includes("generateContent")) {
      generations += 1;
      if (generations === 1) return geminiHttp(NEED_SITE_CONTEXT);
      return geminiHttp("I built CentraWorks at Centra.");
    }
    throw new Error(`unexpected fetch ${url}`);
  }, async () => {
    const result = await ask({ GEMINI_API_KEY: "test-key" }, "What did you build at Centra?");
    assert.equal(generations, 2);
    assert.equal(result.retrieval, "lexical");
    assert.match(result.answer, /CentraWorks/);
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { corpus } from "../app/data/corpus.ts";
import { buildTechRecords } from "../app/data/tech-index.ts";
import { yearsSince } from "../app/data/resume.ts";
import { ask, askStatus, inspectVectors } from "../worker/rag.ts";

test("corpus covers the site copy", () => {
  assert.ok(corpus.length > 10);
  assert.ok(corpus.some((chunk) => chunk.id === "profile"));
  assert.ok(corpus.some((chunk) => chunk.id === "summary"));
  assert.ok(corpus.some((chunk) => chunk.id.includes("centra")));
  assert.ok(corpus.some((chunk) => chunk.id === "tech-csharp-net"));
  assert.ok(corpus.some((chunk) => chunk.id === "tech-react"));
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
  const leaflet = records.find((record) => record.id === "leaflet");
  assert.equal(react?.years, yearsSince(2019, 7, now));
  assert.equal(next?.years, yearsSince(2023, 6, now));
  assert.equal(leaflet?.years, null);
  assert.ok(next?.projects.some((project) => /CentraWorks/i.test(project.name)));
  assert.ok(next?.projects.some((project) => /SouthFraserHUB/i.test(project.name)));
});

test("lexical retrieval answers Centra questions from the corpus", async () => {
  const payload = await ask({}, "What did you build at Centra?");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /CentraWorks|CentraManufacture/i);
  assert.ok(payload.sources.length > 0);
});

test("lexical retrieval answers how many years of a specific tech", async () => {
  const dotnet = await ask({}, "how many years do you have working on .net");
  assert.equal(dotnet.retrieval, "lexical");
  assert.match(dotnet.answer, /\d+ years of professional experience working with C# and \.NET/i);
  assert.ok(dotnet.sources.some((source) => source.id === "tech-csharp-net"));

  const react = await ask({}, "How many years have you worked with React?");
  assert.equal(react.retrieval, "lexical");
  assert.match(react.answer, /\d+ years of professional experience working with React/i);
  assert.ok(react.sources.some((source) => source.id === "tech-react"));
});

test("lexical retrieval lists projects built with a tech", async () => {
  const next = await ask({}, "What projects have you built with Next.js?");
  assert.equal(next.retrieval, "lexical");
  assert.match(next.answer, /CentraWorks/i);
  assert.match(next.answer, /SouthFraserHUB/i);
  assert.ok(next.sources.some((source) => source.id === "tech-nextjs"));

  const listed = await ask({}, "List projects with .NET");
  assert.equal(listed.retrieval, "lexical");
  assert.match(listed.answer, /CentraWorks/i);
  assert.match(listed.answer, /WebTools/i);
  assert.ok(listed.sources.some((source) => source.id === "tech-csharp-net"));
});

test("lexical retrieval says undated toolkit techs have no year count", async () => {
  const payload = await ask({}, "how many years do you have working on Python");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /not stated on this site/i);
  assert.ok(payload.sources.some((source) => source.id === "tech-undated"));
});

test("lexical retrieval summarizes profile info", async () => {
  const payload = await ask({}, "Summarize my info");
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /Vancouver/i);
  assert.match(payload.answer, /Centra Construction Group/i);
  assert.match(payload.answer, /GenXys/i);
  assert.ok(payload.sources.some((source) => source.id === "summary"));
});

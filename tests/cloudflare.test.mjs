import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(route) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${route}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${route}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio routes for Cloudflare Workers", async () => {
  const [homeResponse, resumeResponse, beyondResponse, vectorsResponse] = await Promise.all([
    render("/"),
    render("/resume"),
    render("/beyond-work"),
    render("/vectors"),
  ]);

  for (const response of [homeResponse, resumeResponse, beyondResponse, vectorsResponse]) {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }

  const [home, resume, beyond, vectors] = await Promise.all([
    homeResponse.text(),
    resumeResponse.text(),
    beyondResponse.text(),
    vectorsResponse.text(),
  ]);

  assert.match(home, /<title>AJ Adversalo — Full-Stack Developer<\/title>/i);
  assert.match(home, /Hello I’m/);
  assert.match(home, /AJ Adversalo/);
  assert.match(home, /Ask me a question\.\.\./);
  assert.match(home, /My Technical Toolkit/);
  assert.doesNotMatch(home, /href="\/vectors"/);
  assert.match(resume, /<h1>AJ<br\/>Adversalo/);
  assert.match(resume, /Capabilities \/ 02/);
  assert.doesNotMatch(resume, /href="\/vectors"/);
  assert.match(beyond, /SouthFraserHUB/);
  assert.match(beyond, /STLCraft/);
  assert.doesNotMatch(beyond, /href="\/vectors"/);
  assert.match(vectors, /Vector index/);
});

test("vectors route lists the corpus without Vectorize", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-vectors`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/api/vectors"),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.ok(payload.corpusCount > 10);
  assert.equal(payload.inIndexCount, 0);
  assert.ok(payload.chunks.some((chunk) => chunk.id === "profile"));
});

test("ask route answers from the corpus without Vectorize", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-ask`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "What did you build at Centra?" }),
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.retrieval, "lexical");
  assert.match(payload.answer, /CentraWorks|CentraManufacture/i);
});

test("creates a self-contained Cloudflare Pages export", async () => {
  const [home, resume, beyond, headers] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/resume/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/beyond-work/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/_headers", import.meta.url), "utf8"),
  ]);

  assert.match(home, /Hello I’m/);
  assert.doesNotMatch(home, /_vinext\/image/);
  assert.match(resume, /Capabilities \/ 02/);
  assert.match(beyond, /SouthFraserHUB/);
  assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/);
});

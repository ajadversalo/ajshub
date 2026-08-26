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
  const [homeResponse, resumeResponse] = await Promise.all([
    render("/"),
    render("/resume"),
  ]);

  for (const response of [homeResponse, resumeResponse]) {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }

  const [home, resume] = await Promise.all([
    homeResponse.text(),
    resumeResponse.text(),
  ]);

  assert.match(home, /<title>AJ Adversalo — Full-Stack Developer<\/title>/i);
  assert.match(home, /Modern full-stack development\./);
  assert.match(home, /My Technical Toolkit/);
  assert.match(resume, /<h1>AJ<br\/>Adversalo/);
  assert.match(resume, /Capabilities \/ 02/);
});

test("creates a self-contained Cloudflare Pages export", async () => {
  const [home, resume, headers] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/resume/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/_headers", import.meta.url), "utf8"),
  ]);

  assert.match(home, /Modern full-stack development\./);
  assert.match(home, /src="\/vancouver-skyline\.svg"/);
  assert.doesNotMatch(home, /_vinext\/image/);
  assert.match(resume, /Capabilities \/ 02/);
  assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/);
});

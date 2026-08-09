import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../out/", import.meta.url);
const clientDirectory = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const environment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });

for (const route of ["/", "/resume"]) {
  const response = await worker.fetch(
    new Request(`http://localhost${route}`, {
      headers: { accept: "text/html" },
    }),
    environment,
    executionContext,
  );

  if (!response.ok) {
    throw new Error(`Static export failed for ${route}: ${response.status}`);
  }

  const routeDirectory =
    route === "/" ? outputDirectory : new URL(`.${route}/`, outputDirectory);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(new URL("index.html", routeDirectory), await response.text());
}

console.log("Static site exported to out/");

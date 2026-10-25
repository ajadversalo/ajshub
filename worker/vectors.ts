/** Same-origin `/api/vectors` inspector for the Vectorize index. */

import { inspectVectors, type RagEnv } from "./rag";

export async function handleVectors(request: Request, env: RagEnv): Promise<Response> {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    return Response.json(await inspectVectors(env));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inspect failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

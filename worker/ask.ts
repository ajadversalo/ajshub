/** Same-origin `/api/ask` handler for the portfolio Worker. */

import { ask, askStatus, parseQuestion, type RagEnv } from "./rag";

export async function handleAsk(request: Request, env: RagEnv): Promise<Response> {
  if (request.method === "GET") {
    return Response.json(askStatus(env));
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON with a question" }, { status: 400 });
  }

  const parsed = parseQuestion(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: parsed.status });
  }

  try {
    const result = await ask(env, parsed.question);
    return Response.json({ answer: result.answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ask failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

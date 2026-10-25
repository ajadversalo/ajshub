/**
 * Retrieval-augmented answers over the portfolio corpus.
 *
 * Embeddings: Gemini `gemini-embedding-001` truncated to 768-d.
 * Vector store: Cloudflare Vectorize (`portfolio-rag`, cosine).
 * Generator: Gemini `gemini-3.5-flash-lite` (free tier).
 */

import { PERSON_NAME } from "../app/constants";
import { corpus } from "../app/data/corpus";
import { techChunkIdsForQuestion } from "../app/data/tech-index";

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;
const GENERATION_MODEL = "gemini-3.5-flash-lite";
const TOP_K = 5;
const MERGED_K = 8;
const MAX_QUESTION = 500;
const EMBED_BATCH = 16;

export const VECTORIZE_INDEX = "portfolio-rag";
const GET_BY_IDS_BATCH = 20;
/** Ids previously upserted that the current corpus no longer emits. */
const RETIRED_IDS = ["skill-dotnet"];

export type RagEnv = {
  VECTORIZE?: {
    upsert(
      vectors: { id: string; values: number[]; metadata?: Record<string, string> }[],
    ): Promise<unknown>;
    query(
      vector: number[],
      options: { topK: number; returnMetadata?: "none" | "indexed" | "all" },
    ): Promise<{ matches: Array<{ id: string; score: number; metadata?: Record<string, string> }> }>;
    getByIds?(
      ids: string[],
    ): Promise<Array<{ id: string; values?: number[]; metadata?: Record<string, string> }>>;
    describe?(): Promise<{
      vectorCount?: number;
      dimensions?: number;
      processedUpToDatetime?: number | string;
    }>;
  };
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
};

export type VectorRecord = {
  id: string;
  title: string;
  source: string;
  url: string;
  text: string;
  chars: number;
  inIndex: boolean;
  metadata: Record<string, string> | null;
  dimensions: number | null;
};

export type VectorInspect = {
  indexName: string;
  embeddingModel: string;
  generationModel: string;
  embeddingDimensions: number;
  corpusCount: number;
  inIndexCount: number;
  missingCount: number;
  index: {
    vectorCount: number | null;
    dimensions: number | null;
    processedUpToDatetime: number | string | null;
  } | null;
  indexError?: string;
  chunks: VectorRecord[];
  orphans: VectorRecord[];
};

export type RetrievedChunk = {
  id: string;
  title: string;
  url: string;
  source: string;
  text: string;
  score: number;
};

export type AskResult = {
  answer: string;
  sources: Array<{ id: string; title: string; url: string; score: number }>;
  retrieval: "vectorize" | "lexical";
  retrievalError?: string;
};

const STOP = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "is", "are",
  "was", "were", "you", "your", "me", "my", "at", "did", "do", "does", "what", "which",
  "how", "can", "i", "this", "that", "from",
]);

const WEAK = new Set([
  "years", "year", "working", "worked", "have", "projects", "project", "built",
  "list", "using", "used", "experience", "professional", "many", "specific", "tech",
]);

const chunkById = new Map(corpus.map((chunk) => [chunk.id, chunk]));

let ingestOnce: Promise<void> | null = null;

function geminiKey(env: RagEnv) {
  return env.GEMINI_API_KEY || env.GOOGLE_API_KEY || "";
}

function l2normalize(values: number[]) {
  let sum = 0;
  for (const value of values) sum += value * value;
  const magnitude = Math.sqrt(sum);
  if (!magnitude) return values;
  return values.map((value) => value / magnitude);
}

async function geminiFetch(env: RagEnv, path: string, body: unknown) {
  const key = geminiKey(env);
  if (!key) throw new Error("GEMINI_API_KEY is missing");
  const response = await fetch(`${GEMINI_API}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as {
    error?: { message?: string };
    embeddings?: Array<{ values?: number[] }>;
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  if (!response.ok) {
    throw new Error(payload.error?.message || `Gemini ${response.status}`);
  }
  return payload;
}

export function tokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+#./]+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
}

export function lexicalRetrieve(question: string, topK = TOP_K): RetrievedChunk[] {
  const queryTokens = tokens(question);
  if (queryTokens.length === 0) return [];
  const namedTechChunks = techChunkIdsForQuestion(question);

  return corpus
    .map((chunk) => {
      const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
      let hits = 0;
      for (const token of queryTokens) {
        if (!haystack.includes(token)) continue;
        const weight = WEAK.has(token) ? 0.25 : token.length > 3 ? 2 : 1;
        hits += weight;
        if (chunk.title.toLowerCase().includes(token) && !WEAK.has(token)) hits += 2;
      }
      if (namedTechChunks.has(chunk.id)) hits += 8;
      if (/\bsummar/i.test(question) && chunk.id === "summary") hits += 8;
      return { ...chunk, score: hits / (queryTokens.length * 2) };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

async function embed(env: RagEnv, texts: string[], taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {
  const vectors: number[][] = [];

  for (let offset = 0; offset < texts.length; offset += EMBED_BATCH) {
    const batch = texts.slice(offset, offset + EMBED_BATCH);
    const payload = await geminiFetch(env, `${EMBEDDING_MODEL}:batchEmbedContents`, {
      requests: batch.map((text) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: EMBEDDING_DIMENSIONS,
      })),
    });
    const embeddings = payload.embeddings;
    if (!embeddings || embeddings.length !== batch.length) {
      throw new Error("Embedding model returned an unexpected batch");
    }
    for (const item of embeddings) {
      const values = item.values;
      if (!values || values.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(`Expected ${EMBEDDING_DIMENSIONS}-d embeddings`);
      }
      vectors.push(l2normalize(values));
    }
  }

  return vectors;
}

async function ingest(env: RagEnv) {
  if (!geminiKey(env) || !env.VECTORIZE) return;
  const vectors = await embed(env, corpus.map((chunk) => chunk.text), "RETRIEVAL_DOCUMENT");
  const records = corpus.map((chunk, index) => ({
    id: chunk.id,
    values: vectors[index],
    metadata: {
      title: chunk.title,
      url: chunk.url,
      source: chunk.source,
    },
  }));
  await env.VECTORIZE.upsert(records);
}

function ensureIngest(env: RagEnv) {
  if (!ingestOnce) {
    ingestOnce = ingest(env).catch((error) => {
      ingestOnce = null;
      throw error;
    });
  }
  return ingestOnce;
}

function chunkFromMatch(
  match: { id: string; score: number; metadata?: Record<string, string> },
): RetrievedChunk | null {
  const fallback = chunkById.get(match.id);
  const title = fallback?.title ?? match.metadata?.title;
  const url = fallback?.url ?? match.metadata?.url;
  const source = fallback?.source ?? match.metadata?.source;
  const text = fallback?.text ?? match.metadata?.text;
  if (!title || !url || !source || !text) return null;
  return { id: match.id, title, url, source, text, score: match.score };
}

async function vectorRetrieve(env: RagEnv, question: string): Promise<RetrievedChunk[] | null> {
  if (!geminiKey(env) || !env.VECTORIZE) return null;
  await ensureIngest(env);
  const [queryVector] = await embed(env, [question], "RETRIEVAL_QUERY");
  let result = await env.VECTORIZE.query(queryVector, { topK: TOP_K, returnMetadata: "all" });
  if (result.matches.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    result = await env.VECTORIZE.query(queryVector, { topK: TOP_K, returnMetadata: "all" });
  }
  return result.matches.map(chunkFromMatch).filter((chunk): chunk is RetrievedChunk => chunk !== null);
}

function extractiveAnswer(question: string, retrieved: RetrievedChunk[]) {
  if (retrieved.length === 0) {
    return `I do not have that on this site yet. Try asking about ${PERSON_NAME}'s work at Centra, GenXys, side projects, or how this chat retrieves answers.`;
  }
  const notes = retrieved.map((chunk) => `${chunk.title}: ${chunk.text}`).join("\n\n");
  return `Here is what the site has about “${question.trim()}”:\n\n${notes}`;
}

async function generateAnswer(env: RagEnv, question: string, retrieved: RetrievedChunk[]) {
  if (!geminiKey(env) || retrieved.length === 0) return extractiveAnswer(question, retrieved);

  const context = retrieved
    .map((chunk, index) => `[${index + 1}] ${chunk.title}\nURL: ${chunk.url}\n${chunk.text}`)
    .join("\n\n");

  try {
    const payload = await geminiFetch(env, `${GENERATION_MODEL}:generateContent`, {
      systemInstruction: {
        parts: [{
          text: [
            `You are ${PERSON_NAME}'s portfolio assistant.`,
            "Answer only from the retrieved context.",
            "If the context does not contain the answer, say you do not have that on the site and point to a related fact that is in the context.",
            "Speak in first person as AJ when describing work.",
            "When asked how many years with a technology, state the number and the dated roles from context. If the context says the years are not stated, say that.",
            "When asked which projects were built with a technology, or to list projects with a technology, list every matching project in the context.",
            "When asked to summarize background or info, cover role, location, employers, notable products, side projects, and contact details from context.",
            "Be concise. Do not invent employers, dates, products, or metrics.",
          ].join(" "),
        }],
      },
      contents: [{
        role: "user",
        parts: [{ text: `Question: ${question}\n\nRetrieved context:\n${context}` }],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 700,
      },
    });
    const answer = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    return answer || extractiveAnswer(question, retrieved);
  } catch (error) {
    console.error("Gemini generation failed", error);
    return extractiveAnswer(question, retrieved);
  }
}

function mergeHits(primary: RetrievedChunk[], secondary: RetrievedChunk[]) {
  const seen = new Set<string>();
  const merged: RetrievedChunk[] = [];
  for (const chunk of [...primary, ...secondary]) {
    if (seen.has(chunk.id)) continue;
    seen.add(chunk.id);
    merged.push(chunk);
  }
  return merged;
}

function withGrounding(question: string, retrieved: RetrievedChunk[]) {
  const required = techChunkIdsForQuestion(question);
  if (/\bsummar|background|about you|who are you|\bprofile\b|\binfo\b/i.test(question)) {
    required.add("summary");
  }
  const extras: RetrievedChunk[] = [];
  const have = new Set(retrieved.map((chunk) => chunk.id));
  for (const id of required) {
    if (have.has(id)) continue;
    const chunk = chunkById.get(id);
    if (chunk) extras.push({ ...chunk, score: 1 });
  }
  return mergeHits(extras, retrieved);
}

export async function ask(env: RagEnv, question: string): Promise<AskResult> {
  const trimmed = question.trim();
  let retrieval: AskResult["retrieval"] = "lexical";
  let retrieved = lexicalRetrieve(trimmed);
  let retrievalError: string | undefined;

  try {
    const vectorHits = await vectorRetrieve(env, trimmed);
    if (vectorHits && vectorHits.length > 0) {
      retrieved = mergeHits(vectorHits, retrieved).slice(0, MERGED_K);
      retrieval = "vectorize";
    }
  } catch (error) {
    retrieved = lexicalRetrieve(trimmed);
    retrieval = "lexical";
    retrievalError = error instanceof Error ? error.message : String(error);
    console.error("Vectorize retrieval failed", error);
  }

  retrieved = withGrounding(trimmed, retrieved).slice(0, MERGED_K);

  const answer = await generateAnswer(env, trimmed, retrieved);
  return {
    answer,
    retrieval,
    retrievalError,
    sources: retrieved.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      url: chunk.url,
      score: chunk.score,
    })),
  };
}

export function askStatus(env: RagEnv) {
  return {
    chunks: corpus.length,
    vectorize: Boolean(env.VECTORIZE),
    embeddings: Boolean(geminiKey(env)),
    generator: Boolean(geminiKey(env)),
    embeddingModel: EMBEDDING_MODEL,
    generationModel: GENERATION_MODEL,
  };
}

function emptyInspect(indexError?: string): VectorInspect {
  return {
    indexName: VECTORIZE_INDEX,
    embeddingModel: EMBEDDING_MODEL,
    generationModel: GENERATION_MODEL,
    embeddingDimensions: EMBEDDING_DIMENSIONS,
    corpusCount: corpus.length,
    inIndexCount: 0,
    missingCount: corpus.length,
    index: null,
    indexError,
    chunks: corpus.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      source: chunk.source,
      url: chunk.url,
      text: chunk.text,
      chars: chunk.text.length,
      inIndex: false,
      metadata: null,
      dimensions: null,
    })),
    orphans: [],
  };
}

/** Corpus chunks plus whether each id currently exists in Vectorize. */
export async function inspectVectors(env: RagEnv): Promise<VectorInspect> {
  const report = emptyInspect(env.VECTORIZE ? undefined : "VECTORIZE binding missing");
  if (!env.VECTORIZE) return report;

  try {
    if (env.VECTORIZE.describe) {
      const info = await env.VECTORIZE.describe();
      report.index = {
        vectorCount: info.vectorCount ?? null,
        dimensions: info.dimensions ?? null,
        processedUpToDatetime: info.processedUpToDatetime ?? null,
      };
    }
  } catch (error) {
    report.indexError = error instanceof Error ? error.message : String(error);
  }

  if (typeof env.VECTORIZE.getByIds !== "function") return report;
  const index = env.VECTORIZE;

  try {
    const found = new Map<string, { id: string; values?: number[]; metadata?: Record<string, string> }>();
    for (let offset = 0; offset < corpus.length; offset += GET_BY_IDS_BATCH) {
      const ids = corpus.slice(offset, offset + GET_BY_IDS_BATCH).map((chunk) => chunk.id);
      const rows = await index.getByIds(ids);
      for (const row of rows) found.set(row.id, row);
    }
    for (const chunk of report.chunks) {
      const row = found.get(chunk.id);
      if (!row) continue;
      chunk.inIndex = true;
      chunk.metadata = row.metadata ?? null;
      chunk.dimensions = Array.isArray(row.values) ? row.values.length : null;
    }
    report.inIndexCount = report.chunks.filter((chunk) => chunk.inIndex).length;
    report.missingCount = report.corpusCount - report.inIndexCount;

    const retired = RETIRED_IDS.filter((id) => !found.has(id));
    if (retired.length > 0) {
      const leftover = await index.getByIds(retired);
      report.orphans = leftover.map((row) => ({
        id: row.id,
        title: "Not in the current corpus",
        source: "stale",
        url: "",
        text: "",
        chars: 0,
        inIndex: true,
        metadata: row.metadata ?? null,
        dimensions: Array.isArray(row.values) ? row.values.length : null,
      }));
    }
  } catch (error) {
    report.indexError = error instanceof Error ? error.message : String(error);
  }

  return report;
}

export function parseQuestion(body: unknown) {
  const question = typeof (body as { question?: unknown })?.question === "string"
    ? (body as { question: string }).question.trim()
    : "";
  if (!question) return { error: "Question is required", status: 400 as const };
  if (question.length > MAX_QUESTION) return { error: "Question is too long", status: 400 as const };
  return { question };
}

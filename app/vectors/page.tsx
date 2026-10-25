"use client";

import { useEffect, useMemo, useState } from "react";
import SiteNav from "../components/site-nav";
import { COPY, VECTORS_API_PATH } from "../constants";
import { corpus } from "../data/corpus";

type VectorRecord = {
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

type VectorInspect = {
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

const corpusChunks: VectorRecord[] = corpus.map((chunk) => ({
  id: chunk.id,
  title: chunk.title,
  source: chunk.source,
  url: chunk.url,
  text: chunk.text,
  chars: chunk.text.length,
  inIndex: false,
  metadata: null,
  dimensions: null,
}));

function formatProcessed(value: number | string | null) {
  if (value == null) return "—";
  if (typeof value === "number") {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
  }
  return value;
}

export default function VectorsPage() {
  const [live, setLive] = useState<VectorInspect | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [presence, setPresence] = useState("all");

  useEffect(() => {
    let cancelled = false;
    fetch(VECTORS_API_PATH)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Inspector returned ${response.status}`);
        return response.json() as Promise<VectorInspect>;
      })
      .then((payload) => {
        if (!cancelled) setLive(payload);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : COPY.vectorsUnavailable);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const report = live ?? {
    indexName: "portfolio-rag",
    embeddingModel: "gemini-embedding-001",
    generationModel: "gemini-3.5-flash-lite",
    embeddingDimensions: 768,
    corpusCount: corpusChunks.length,
    inIndexCount: 0,
    missingCount: corpusChunks.length,
    index: null,
    chunks: corpusChunks,
    orphans: [],
  };

  const sources = useMemo(() => {
    return [...new Set(report.chunks.map((chunk) => chunk.source))].sort();
  }, [report.chunks]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return report.chunks.filter((chunk) => {
      if (source !== "all" && chunk.source !== source) return false;
      if (presence === "in" && !chunk.inIndex) return false;
      if (presence === "missing" && chunk.inIndex) return false;
      if (!needle) return true;
      return `${chunk.id} ${chunk.title} ${chunk.text}`.toLowerCase().includes(needle);
    });
  }, [presence, query, report.chunks, source]);

  const stale =
    report.index?.vectorCount != null && report.index.vectorCount > report.inIndexCount
      ? report.index.vectorCount - report.inIndexCount
      : 0;

  return (
    <main>
      <SiteNav current="vectors" />
      <section className="vectors shell">
        <header className="vectors-intro">
          <p className="eyebrow">Cloudflare Vectorize</p>
          <h1>{COPY.vectorsHeading}</h1>
          <p>{COPY.vectorsIntro}</p>
        </header>

        <dl className="vectors-stats">
          <div>
            <dt>Index</dt>
            <dd>{report.indexName}</dd>
          </div>
          <div>
            <dt>Corpus chunks</dt>
            <dd>{report.corpusCount}</dd>
          </div>
          <div>
            <dt>In Vectorize</dt>
            <dd>{live ? report.inIndexCount : "…"}</dd>
          </div>
          <div>
            <dt>Missing from index</dt>
            <dd>{live ? report.missingCount : "…"}</dd>
          </div>
          <div>
            <dt>Index vector count</dt>
            <dd>{report.index?.vectorCount ?? (live ? "—" : "…")}</dd>
          </div>
          <div>
            <dt>Dimensions</dt>
            <dd>{report.index?.dimensions ?? report.embeddingDimensions}</dd>
          </div>
          <div>
            <dt>Embed / generate</dt>
            <dd>{report.embeddingModel} · {report.generationModel}</dd>
          </div>
          <div>
            <dt>Last processed</dt>
            <dd>{live ? formatProcessed(report.index?.processedUpToDatetime ?? null) : "…"}</dd>
          </div>
        </dl>

        {error ? <p className="vectors-note">{COPY.vectorsUnavailable} {error}</p> : null}
        {report.indexError ? <p className="vectors-note">{report.indexError}</p> : null}
        {stale > 0 ? (
          <p className="vectors-note">
            The index reports {stale} more vector{stale === 1 ? "" : "s"} than the current corpus
            ids{report.orphans.length ? ` (including ${report.orphans.map((row) => row.id).join(", ")})` : ". Leftover ids are not listed unless they match a known retired id"}.
          </p>
        ) : null}

        {report.orphans.length > 0 ? (
          <ol className="vectors-list">
            {report.orphans.map((chunk) => (
              <li key={`orphan-${chunk.id}`}>
                <details>
                  <summary>
                    <span className="vectors-flag is-in">stale</span>
                    <span className="vectors-id">{chunk.id}</span>
                    <span className="vectors-title">{chunk.title}</span>
                    <span className="vectors-meta">in Vectorize, dropped from corpus</span>
                  </summary>
                  {chunk.metadata ? (
                    <pre className="vectors-json">{JSON.stringify(chunk.metadata, null, 2)}</pre>
                  ) : null}
                  {chunk.dimensions != null ? <p className="vectors-meta">Stored vector: {chunk.dimensions}-d</p> : null}
                </details>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="vectors-toolbar">
          <label>
            <span className="visually-hidden">{COPY.vectorsFilter}</span>
            <select value={source} onChange={(event) => setSource(event.target.value)} aria-label={COPY.vectorsFilter}>
              <option value="all">All sources</option>
              {sources.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="visually-hidden">Index presence</span>
            <select value={presence} onChange={(event) => setPresence(event.target.value)} aria-label="Index presence">
              <option value="all">In index and missing</option>
              <option value="in">In Vectorize</option>
              <option value="missing">Missing from Vectorize</option>
            </select>
          </label>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={COPY.vectorsSearch}
            aria-label={COPY.vectorsSearch}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="vectors-note">{COPY.vectorsEmpty}</p>
        ) : (
          <ol className="vectors-list">
            {filtered.map((chunk) => (
              <li key={chunk.id}>
                <details>
                  <summary>
                    <span className={`vectors-flag${chunk.inIndex ? " is-in" : ""}`}>
                      {chunk.inIndex ? "in index" : "corpus only"}
                    </span>
                    <span className="vectors-id">{chunk.id}</span>
                    <span className="vectors-title">{chunk.title}</span>
                    <span className="vectors-meta">{chunk.source} · {chunk.chars} chars</span>
                  </summary>
                  <p className="vectors-url">{chunk.url}</p>
                  {chunk.metadata ? (
                    <pre className="vectors-json">{JSON.stringify(chunk.metadata, null, 2)}</pre>
                  ) : null}
                  {chunk.dimensions != null ? <p className="vectors-meta">Stored vector: {chunk.dimensions}-d</p> : null}
                  <pre className="vectors-text">{chunk.text}</pre>
                </details>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

# Architecture

AJ Adversalo portfolio at [portfolio.ajhub.ca](https://portfolio.ajhub.ca). The site is two packages: `f/` (vinext frontend) and `backend/` (RAG Worker). Frontend runtime is [vinext](https://github.com/cloudflare/vinext) (Vite + Next App Router APIs) on Node `>=22.13`.

## Routes

| Path | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero ask panel, toolkit, experience |
| `/beyond-work` | `app/beyond-work/page.tsx` | Side projects |
| `/resume` | `app/resume/page.tsx` | Printable résumé |
| `https://portfolioapi.ajhub.ca/api/ask` | `../backend` Worker `portfolioapi` | RAG retrieve-and-answer over the site corpus |

## Source layout

| Path | Role |
| --- | --- |
| `app/constants.ts` | Identity, URLs, routes, section ids, theme keys, UI copy |
| `app/data/` | Experience chapters, toolbox groups, side projects, résumé content, skill icons, RAG corpus |
| `../backend/` | Ask Worker: ingest, Vectorize query, Grok generation |
| `app/components/` | Shared UI. See [components.md](./components.md) |
| `app/styles/` | CSS split by surface. See [styles.md](./styles.md) |
| `app/globals.css` | Tailwind plus style imports |
| `public/images/` | Site images. See [images.md](./images.md) |
| `public/favicon.*` | Lime AJ square tab icons at site root (relative hrefs, cache-busted) |

## Theme

`html[data-theme]` is `light` or `dark`. Default is light. `localStorage` key `theme`. The layout FOUC script and `ThemeToggle` must stay in sync.

Do not put favicon paths on the Next `Metadata` export. `metadataBase` would absolutize them to production URLs and 404 locally.

## Ask panel (RAG)

Home hero is an ask field. Focus or submit opens a chat. The browser calls Worker `portfolioapi` (`ASK_API_URL` = `https://portfolioapi.ajhub.ca/api/ask`, or `ASK_API_URL_LOCAL` on localhost). Chunks are built from `app/data/corpus.ts` and imported by the backend.

Pipeline:

1. Chunk site copy (profile, experience, résumé, toolkit, side projects).
2. Embed with Gemini `gemini-embedding-001` (768-d, free tier).
3. Upsert into Cloudflare Vectorize index `portfolio-rag` (cosine).
4. Embed the question, take top-5 neighbors, generate with Gemini `gemini-3.5-flash-lite` using only those chunks.

From `backend/`:

```bash
npx wrangler vectorize create portfolio-rag --dimensions=768 --metric=cosine
cp .dev.vars.example .dev.vars
# GEMINI_API_KEY from https://aistudio.google.com/apikey
npm run dev
```

If Vectorize or `GEMINI_API_KEY` is missing, retrieval falls back to lexical search over the same chunks.

## Tests

`npm test` in `f/` builds Worker + Pages artifacts and runs `tests/cloudflare.test.mjs` against `/`, `/resume`, and `/beyond-work`. `npm test` in `backend/` runs the corpus and `/api/ask` tests. The Pages export writes those three routes into `out/`.

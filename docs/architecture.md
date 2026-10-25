# Architecture

AJ Adversalo portfolio at [portfolio.ajhub.ca](https://portfolio.ajhub.ca). One vinext app in `f/` (Vite + Next App Router APIs) on Node `>=22.13`, deployed as a Cloudflare Worker. Pages (`/`, `/resume`, `/beyond-work`) and `/api/ask` share that Worker.

## Routes

| Path | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero ask panel, toolkit, work |
| `/beyond-work` | `app/beyond-work/page.tsx` | Side Projects |
| `/resume` | `app/resume/page.tsx` | Printable résumé |
| `/vectors` | `app/vectors/page.tsx` | Unlisted Vectorize inspector (no nav link, `noindex`) |
| `/api/ask` | `worker/ask.ts` | RAG retrieve-and-answer over the site corpus |
| `/api/vectors` | `worker/vectors.ts` | Corpus + Vectorize `describe` / `getByIds` dump |

## Source layout

| Path | Role |
| --- | --- |
| `app/constants.ts` | Identity, URLs, routes, section ids, theme keys, UI copy |
| `app/data/` | Experience chapters, toolbox groups, side projects, résumé content, skill icons, RAG corpus |
| `worker/` | Cloudflare Worker entry, image optimization, `/api/ask` RAG |
| `app/components/` | Shared UI. See [components.md](./components.md) |
| `app/styles/` | CSS split by surface. See [styles.md](./styles.md) |
| `app/globals.css` | Tailwind plus style imports |
| `public/images/` | Site images. See [images.md](./images.md) |
| `public/favicon.*` | Lime AJ square tab icons at site root (relative hrefs, cache-busted) |

## Theme

`html[data-theme]` is `light` or `dark`. Default is light. `localStorage` key `theme`. The layout FOUC script and `ThemeToggle` must stay in sync.

Do not put favicon paths on the Next `Metadata` export. `metadataBase` would absolutize them to production URLs and 404 locally.

## Ask panel (RAG)

Home hero is an ask field. Focus or submit opens a chat. The browser posts to same-origin `ASK_API_PATH` (`/api/ask`). Chunks are built from `app/data/corpus.ts` and retrieved in `worker/rag.ts`.

Pipeline:

1. Chunk site copy (profile, experience, résumé, toolkit, side projects).
2. Embed with Gemini `gemini-embedding-001` (768-d, free tier).
3. Upsert into Cloudflare Vectorize index `portfolio-rag` (cosine).
4. Embed the question, take top-5 neighbors, generate with Gemini `gemini-3.5-flash-lite` using only those chunks.

```bash
npx wrangler vectorize create portfolio-rag --dimensions=768 --metric=cosine
cp .dev.vars.example .dev.vars
# GEMINI_API_KEY from https://aistudio.google.com/apikey
npx wrangler secret put GEMINI_API_KEY
npm run deploy:worker
```

If Vectorize or `GEMINI_API_KEY` is missing, retrieval falls back to lexical search over the same chunks.

## Tests

`npm test` runs corpus/lexical tests (`tests/ask.test.ts`), then builds Worker + Pages artifacts and runs `tests/cloudflare.test.mjs` against `/`, `/resume`, `/beyond-work`, `/vectors`, `/api/ask`, and `/api/vectors`. The Pages export writes HTML routes into `out/`. `/api/ask` and `/api/vectors` exist on the Worker deploy, not on the static Pages export.

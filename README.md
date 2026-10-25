# Built by AJ portfolio

AJ Adversalo's site at [portfolio.ajhub.ca](https://portfolio.ajhub.ca). Next.js App Router APIs on [vinext](https://github.com/cloudflare/vinext), deployable as a Cloudflare Worker or a static Pages export.

## Docs

- [Architecture](docs/architecture.md) — routes, folders, theme
- [Components](docs/components.md) — shared UI and props
- [Styles](docs/styles.md) — CSS layers and tokens
- [Images](docs/images.md) — `public/images/` layout

Site copy and URLs live in `app/constants.ts`. Job history, toolkit groups, side projects, résumé content, and the RAG corpus live in `app/data/`. Shared UI lives in `app/components/`. CSS lives in `app/styles/`. The home ask panel posts to `/api/ask` on this Worker; see [Architecture](docs/architecture.md#ask-panel-rag).

## Prerequisites

- Node.js `>=22.13.0`

## Commands

```bash
npm install
npm run dev
npm run build
```

`npm run build` creates both deployment artifacts:

- `dist/` — Cloudflare Worker and its static assets
- `out/` — static Cloudflare Pages export (`/`, `/resume`, `/beyond-work`)

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local vinext dev server |
| `npm run build:worker` | Worker artifact only |
| `npm run deploy:worker` | Build and deploy to Workers |
| `npm run deploy:pages` | Build and deploy to Pages |
| `npm run cf:typegen` | Regenerate Cloudflare types |
| `npm test` | Corpus tests, then build both artifacts and run `tests/cloudflare.test.mjs` |
| `npm run db:generate` | Drizzle migrations (optional D1) |

## Deploy to Cloudflare

Authenticate once with `npx wrangler login`, or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in CI.

```bash
npm run deploy:worker
npm run deploy:pages
```

For a Git-connected Cloudflare build:

| Target | Build command | Deploy command |
| --- | --- | --- |
| Workers | `npm run build:worker` | `npx wrangler deploy --config dist/server/wrangler.json` |
| Pages | `npm run build` | `npx wrangler pages deploy out --project-name builtbyaj-portfolio` |

The Worker uses Cloudflare Images for `next/image`. The Pages export uses pre-rendered local image URLs.

## Vinext extras

The starter still includes optional Sites pieces that this portfolio does not use yet:

- `.openai/hosting.json` — D1/R2 bindings (`null` here)
- `db/` + `drizzle.config.ts` — empty schema until a database is needed
- `vite.config.ts` — local binding simulation

Ask (`/api/ask`) runs on this Worker: Vectorize index `portfolio-rag`, Gemini free-tier embeddings and Flash-Lite. Put `GEMINI_API_KEY` in `.dev.vars` locally and `npx wrangler secret put GEMINI_API_KEY` for production.

Favicons stay at the public root with relative, cache-busted hrefs. Do not put them on the Next `Metadata` export.

## Learn more

- [vinext](https://github.com/cloudflare/vinext)
- [Drizzle D1](https://orm.drizzle.team/docs/get-started/d1-new)

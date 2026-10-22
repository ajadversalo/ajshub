# Architecture

AJ Adversalo portfolio at [builtbyaj.dev](https://builtbyaj.dev). Runtime is [vinext](https://github.com/cloudflare/vinext) (Vite + Next App Router APIs) on Node `>=22.13`.

## Routes

| Path | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero, toolkit, experience |
| `/beyond-work` | `app/beyond-work/page.tsx` | Side projects |
| `/resume` | `app/resume/page.tsx` | Printable résumé |

## Source layout

| Path | Role |
| --- | --- |
| `app/constants.ts` | Identity, URLs, routes, section ids, theme keys, UI copy |
| `app/data/` | Experience chapters, toolbox groups, side projects, résumé content, skill icons |
| `app/components/` | Shared UI. See [components.md](./components.md) |
| `app/styles/` | CSS split by surface. See [styles.md](./styles.md) |
| `app/globals.css` | Tailwind plus style imports |
| `public/images/` | Site images. See [images.md](./images.md) |
| `public/favicon.*` | Lime AJ square tab icons at site root (relative hrefs, cache-busted) |

## Theme

`html[data-theme]` is `light` or `dark`. Default is light. `localStorage` key `theme`. The layout FOUC script and `ThemeToggle` must stay in sync.

Do not put favicon paths on the Next `Metadata` export. `metadataBase` would absolutize them to production URLs and 404 locally.

## Tests

`npm test` builds Worker + Pages artifacts and runs `tests/cloudflare.test.mjs` against `/`, `/resume`, and `/beyond-work`. The Pages export writes those three routes into `out/`.

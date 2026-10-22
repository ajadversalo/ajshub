# Styles

`app/globals.css` only imports Tailwind and the files under `app/styles/`.

| File | Surface |
| --- | --- |
| `tokens.css` | `--ink`, `--paper`, `--muted`, `--line`, `--accent`, `--nav-signal`, `--lime`, `--brand-ink` |
| `base.css` | Reset, `body`, `.shell` |
| `nav.css` | Header, monogram, theme toggle |
| `hero.css` | Home intro and CTAs |
| `toolbox.css` | Toolkit grid and filter |
| `experience.css` | Chapters, stacks, product cards |
| `beyond.css` | Beyond Work cards |
| `resume.css` | Résumé sheet |
| `media.css` | Breakpoints, reduced motion, print |

Do not reintroduce jammed multi-selector one-liners; keep one block per selector.

Light/dark is `html[data-theme]`. Nav mark: dark = lime plate + dark AJ; light = dark plate + lime AJ.

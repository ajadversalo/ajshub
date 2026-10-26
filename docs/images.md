# Images

Static images live under `public/images/`. Paths are declared in `app/constants.ts` (`ASSETS`, `IMAGES`, `techIconSrc`).

| Folder | Contents |
| --- | --- |
| `images/brand/` | Open Graph share image (`og.png`) |
| `images/companies/` | Employer logos used in experience chapters |
| `images/diagrams/` | Ask workflow sheet shown in the chat viewer (`ask-workflow.jpg`) |
| `images/projects/` | Beyond Work project marks |
| `images/tech/` | Skill SVGs keyed from `app/data/tech-icons.ts` |

Favicons stay at the public root (`/favicon.ico`, `/favicon.svg`, `/favicon.png`, `/apple-touch-icon.png`) so browsers and the layout head links keep working. Product-card watermarks use the company PNG logos. The Ask dialog View workflow control opens `/images/diagrams/ask-workflow.jpg` in a zoomable overlay.

# Site content

Structured copy that is too large for `app/constants.ts`.

| File | Used on |
| --- | --- |
| `experience.ts` | Homepage chapters |
| `portfolio.ts` | Toolbox groups and Beyond Work cards |
| `resume.ts` | `/resume` sheet |
| `tech-icons.ts` | Skill SVGs for `TechIcon` |
| `corpus.ts` | RAG chunks imported by `worker/rag.ts` |
| `tech-index.ts` | Per-tech years and project lists used by corpus Ask chunks |
| `facts.ts` | Live tenure/count calculator for Ask (`think()`: developer years from GenXys through now, side-project counts) |

Skill names in toolbox, stacks, and Beyond Work must match keys in `tech-icons.ts`.

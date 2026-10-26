# Components

Shared UI lives in `app/components/`. Each exported component has TSDoc, a `*Props` type, and runtime `propTypes` where it takes props.

| Component | Props | Used on |
| --- | --- | --- |
| `SiteNav` | `current`: `"home"` \| `"beyond-work"` \| `"resume"` \| `"vectors"` | All pages. Nav labels are Tools, Work, Side Projects. `vectors` is unlisted (no nav item). |
| `ThemeToggle` | none | Inside `SiteNav` |
| `TechIcon` | `tool`, `size?` | Toolbox, experience stack, Beyond Work |
| `TechChips` | `tools`, `size?`, `label?` | Same as `TechIcon` |
| `ToolboxSection` | none | Home |
| `FitTitle` | `children: string` | Experience product cards |
| `AskChat` | none | Home hero. Header **View workflow** opens `ask-workflow.jpg` in a zoomable overlay. |

`scrollToSection` is a click helper for in-page hashes (`#toolbox`, `#experience-archive`, `#top`).

Copy, URLs, and section ids come from `app/constants.ts`. Skill names must match keys in `app/data/tech-icons.ts` or the icon is omitted.

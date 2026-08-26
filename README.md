# Built by AJ portfolio

AJ Adversalo's portfolio, built with Next.js APIs on
[vinext](https://github.com/cloudflare/vinext). It can be deployed either as a
server-rendered Cloudflare Worker or as a static Cloudflare Pages site.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

`npm run build` creates both deployment artifacts:

- `dist/` contains the Cloudflare Worker and its static assets.
- `out/` contains the static Cloudflare Pages export.

## Deploy to Cloudflare

Authenticate once with `npx wrangler login`, or set `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` in CI.

Deploy the server-rendered application to Workers:

```bash
npm run deploy:worker
```

Deploy the static export to Pages:

```bash
npm run deploy:pages
```

For a Git-connected Cloudflare build, use the following settings:

| Target | Build command | Deploy command |
| --- | --- | --- |
| Workers | `npm run build:worker` | `npx wrangler deploy --config dist/server/wrangler.json` |
| Pages | `npm run build` | `npx wrangler pages deploy out --project-name builtbyaj-portfolio` |

The Worker deployment uses Cloudflare Images for the `next/image` optimization
endpoint. The Pages artifact uses the pre-rendered local image URLs and does not
require the Images binding.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: build the Worker and static Pages artifacts
- `npm run build:worker`: build only the Cloudflare Worker artifact
- `npm run deploy:worker`: build and deploy to Cloudflare Workers
- `npm run deploy:pages`: build and deploy to Cloudflare Pages
- `npm run cf:typegen`: regenerate Cloudflare runtime and binding types
- `npm test`: build and verify both Cloudflare deployment artifacts
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

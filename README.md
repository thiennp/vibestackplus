# vibestackplus

Next.js application deployed on [Vercel](https://vercel.com).

Project tooling mirrors the `chords` / `chords-fp96` deployment harness where it applies to this repo: pnpm, git hooks, and Vercel build settings.

## Development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Git hooks are installed automatically on `pnpm install` via `scripts/install-git-hooks.mjs` and run typecheck + lint before commits.

## Deployment

This repo deploys to the **vibestackplus** Vercel project only (not `chords-fp96` / Wishees).

Pushes to `main` trigger automatic production deploys via the GitHub integration.

Manual deploy (always targets `vibestackplus`):

```bash
pnpm run deploy
```

Production URLs:

- https://vibestackplus.com
- https://www.vibestackplus.com
- https://vibestackplus.vercel.app

Vercel project settings aligned with `chords-fp96`:

- Node.js 24.x
- `iad1` function region
- fixed build machine selection
- SSO protection on preview URLs
- OIDC token config enabled

## Scripts

- `pnpm run dev` — start development server
- `pnpm run build` — production build
- `pnpm run build:vercel` — Vercel production build entrypoint
- `pnpm run start` — start production server
- `pnpm run lint` — run ESLint
- `pnpm run typecheck` — run TypeScript checks
- `pnpm run deploy` — deploy to the `vibestackplus` Vercel project

## Copied from chords

Copied into this repo:

- deployment settings: `vercel.json`, `build:vercel`, pnpm package manager, `.vercelignore`
- harness: git hook installer and `.githooks/pre-commit`
- Vercel project configuration via API

Not copied yet because `thiennp/chords` is private and inaccessible to this agent token:

- architecture settings files (for example `.cursor/rules`, `architecture/*`)
- any additional harness files beyond the git-hook installer surfaced in chords build logs

Grant the Cursor GitHub app access to `thiennp/chords`, or share those files, to finish the architecture/harness copy.

# Scaffold Platform

Monorepo for the **Scaffolding as a Service** platform — visually configure your project stack and deploy scaffolding directly to your local machine.

Project tooling mirrors the `chords` / `chords-fp96` deployment harness where it applies to this repo: pnpm, git hooks, and Vercel build settings.

## Architecture

| Package | Description |
|---------|-------------|
| `apps/web` | Next.js dashboard for stack configuration and agent pairing |
| `apps/ws-server` | Socket.io relay server pairing web sessions with local CLI agents |
| `packages/cli` | Local CLI agent (`scaffold-agent`) that receives scaffold commands |
| `packages/shared` | Shared TypeScript types and socket event definitions |

## Prerequisites

- Node.js 20+
- pnpm 10+

## Getting Started

```bash
pnpm install
pnpm dev
```

This starts:

- **Web dashboard** at [http://localhost:3000](http://localhost:3000)
- **WebSocket relay** at [http://localhost:3001](http://localhost:3001)
- **CLI package** in watch/build mode

Git hooks are installed automatically on `pnpm install` via `scripts/install-git-hooks.mjs` and run typecheck + lint before commits.

## Pairing Flow

1. Open the web dashboard and click **Generate Connection Token**
2. In a separate terminal, connect the local agent:

```bash
pnpm --filter @scaffold/cli build
node packages/cli/dist/index.js connect <6-digit-token>
```

3. Once the agent connects, configure your stack and click **Deploy to Local**

## Deployment

This repo deploys to the **vibestackplus** Vercel project only (not `chords-fp96` / Wishees).

Pushes to `main` trigger automatic production deploys via the GitHub integration.

Manual deploy:

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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web app, WS server, and CLI build concurrently |
| `pnpm build` | Build all packages |
| `pnpm build:vercel` | Vercel production build entrypoint |
| `pnpm typecheck` | Run TypeScript checks across the monorepo |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm deploy` | Deploy to the `vibestackplus` Vercel project |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | WebSocket relay URL for the dashboard |
| `PORT` | `3001` | WS server port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin for WS server |
| `SCAFFOLD_WS_URL` | `http://localhost:3001` | WS server URL for the CLI agent |

## Copied from chords

Copied into this repo:

- deployment settings: `vercel.json`, `build:vercel`, pnpm package manager, `.vercelignore`
- harness: git hook installer and `.githooks/pre-commit`
- Vercel project configuration via API

Not copied yet because `thiennp/chords` is private and inaccessible to this agent token:

- architecture settings files (for example `.cursor/rules`, `architecture/*`)
- any additional harness files beyond the git-hook installer surfaced in chords build logs

Grant the Cursor GitHub app access to `thiennp/chords`, or share those files, to finish the architecture/harness copy.

# Scaffold Platform

Monorepo for the **Scaffolding as a Service** platform — visually configure your project stack and deploy scaffolding directly to your local machine.

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

## Pairing Flow

1. Open the web dashboard and click **Generate Connection Token**
2. In a separate terminal, connect the local agent:

```bash
pnpm --filter @scaffold/cli build
node packages/cli/dist/index.js connect <6-digit-token>
```

3. Once the agent connects, configure your stack and click **Deploy to Local**

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web app, WS server, and CLI build concurrently |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Run TypeScript checks across the monorepo |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | WebSocket relay URL for the dashboard |
| `PORT` | `3001` | WS server port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin for WS server |
| `SCAFFOLD_WS_URL` | `http://localhost:3001` | WS server URL for the CLI agent |

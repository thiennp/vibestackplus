# vibestackplus

Next.js application deployed on [Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This repo deploys to the **vibestackplus** Vercel project only (not `chords-fp96` / Wishees).

Pushes to `main` trigger automatic production deploys via the GitHub integration.

Manual deploy (always targets `vibestackplus`):

```bash
npm run deploy
```

Production URLs:

- https://vibestackplus.com
- https://www.vibestackplus.com
- https://vibestackplus.vercel.app

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks

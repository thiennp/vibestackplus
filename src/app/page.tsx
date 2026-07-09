export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          VibeStack Plus
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Deployed on Vercel
        </h1>
        <p className="text-lg leading-8 text-zinc-400">
          Your Next.js app is live. Start building by editing{" "}
          <code className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-200">
            src/app/page.tsx
          </code>
          .
        </p>
      </div>
    </main>
  );
}

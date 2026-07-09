"use client";

import { FormEvent, useState } from "react";
import type { ProjectConfig } from "@scaffold/shared";
import { useScaffoldSocket } from "@/hooks/useScaffoldSocket";

const PROJECT_TYPES = ["SaaS App", "E-commerce", "Blog", "Dashboard"];
const FRONTENDS = ["Next.js", "Remix", "Astro", "Vite + React"];
const STATE_FLOWS = ["Zustand", "Redux Toolkit", "Jotai", "React Context"];
const PATTERNS = ["Clean Architecture", "Feature-Sliced Design", "Modular Monolith", "Micro-frontends"];

const defaultConfig: ProjectConfig = {
  projectType: PROJECT_TYPES[0],
  frontend: FRONTENDS[0],
  stateFlow: STATE_FLOWS[0],
  pattern: PATTERNS[0],
};

export default function HomePage() {
  const {
    connectionToken,
    isConnected,
    isAgentConnected,
    generateToken,
    startScaffold,
    error,
  } = useScaffoldSocket();

  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);
  const [deployed, setDeployed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startScaffold(config);
    setDeployed(true);
  }

  function updateConfig<K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setDeployed(false);
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Scaffolding as a Service
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Project Scaffold Dashboard</h1>
          <p className="text-zinc-400">
            Configure your stack, pair your local CLI agent, and deploy scaffolding directly to
            your machine.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Agent Pairing</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isConnected
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              {isConnected ? "Relay connected" : "Relay disconnected"}
            </span>
          </div>

          <button
            type="button"
            onClick={generateToken}
            disabled={!isConnected}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate Connection Token
          </button>

          {connectionToken && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4 space-y-2">
              <p className="text-sm text-zinc-400">Your connection token:</p>
              <p className="font-mono text-4xl font-bold tracking-[0.3em] text-indigo-300">
                {connectionToken}
              </p>
              <p className="text-sm text-zinc-500">
                Run in your terminal:{" "}
                <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                  npx scaffold-agent connect {connectionToken}
                </code>
              </p>
              <p
                className={`text-sm font-medium ${
                  isAgentConnected ? "text-green-400" : "text-amber-400"
                }`}
              >
                {isAgentConnected
                  ? "✓ Local agent connected"
                  : "Waiting for local agent to connect..."}
              </p>
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold">Project Configuration</h2>

          <fieldset className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-300">Project Type</span>
              <select
                value={config.projectType}
                onChange={(e) => updateConfig("projectType", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              >
                {PROJECT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-300">Frontend</span>
              <select
                value={config.frontend}
                onChange={(e) => updateConfig("frontend", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              >
                {FRONTENDS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-300">State Management</span>
              <select
                value={config.stateFlow}
                onChange={(e) => updateConfig("stateFlow", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              >
                {STATE_FLOWS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-300">Architecture Pattern</span>
              <select
                value={config.pattern}
                onChange={(e) => updateConfig("pattern", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
              >
                {PATTERNS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={!isAgentConnected}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Deploy to Local
          </button>

          {deployed && isAgentConnected && (
            <p className="text-center text-sm text-green-400">
              Scaffold command sent to local agent.
            </p>
          )}
        </form>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}

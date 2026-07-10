import { execFileSync } from "node:child_process";

const hooksPath = ".githooks";

try {
  execFileSync("git", ["config", "core.hooksPath", hooksPath], {
    stdio: "inherit",
  });
  console.log(`install-git-hooks: core.hooksPath=${hooksPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`install-git-hooks: skipped (${message})`);
}

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import type { ProjectConfig } from "@scaffold/shared";

export function executeScaffold(config: ProjectConfig): void {
  console.log(chalk.cyan("\n📦 Received scaffold configuration:"));
  console.log(chalk.gray(JSON.stringify(config, null, 2)));

  const projectFolderName = config.projectType.toLowerCase().replace(/\s+/g, "-");
  const outputDir = join(process.cwd(), projectFolderName);

  mkdirSync(outputDir, { recursive: true });

  const readme = `# ${config.projectType}

Scaffolded by Scaffold Agent.

## Stack

| Setting | Choice |
|---------|--------|
| Project Type | ${config.projectType} |
| Frontend | ${config.frontend} |
| State Management | ${config.stateFlow} |
| Architecture Pattern | ${config.pattern} |

## Next Steps

1. Review the generated project structure
2. Install dependencies
3. Start development
`;

  writeFileSync(join(outputDir, "README.md"), readme, "utf-8");

  console.log(chalk.green(`\n✅ Created project folder: ${outputDir}`));
  console.log(chalk.green(`✅ Wrote README.md with stack summary\n`));
}

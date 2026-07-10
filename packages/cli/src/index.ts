#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { io, Socket } from "socket.io-client";
import {
  PairAgentPayload,
  ProjectConfig,
  SocketEvents,
} from "@scaffold/shared";
import { executeScaffold } from "./scaffold.js";

const DEFAULT_WS_URL = process.env.SCAFFOLD_WS_URL ?? "http://localhost:3001";

function connectAgent(token: string, wsUrl: string): void {
  if (!/^\d{6}$/.test(token)) {
    console.error(chalk.red("Error: Token must be a 6-digit number."));
    process.exit(1);
  }

  console.log(chalk.blue(`Connecting to relay server at ${wsUrl}...`));
  console.log(chalk.gray(`Using connection token: ${token}`));

  const socket: Socket = io(wsUrl, {
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log(chalk.green("Connected to relay server."));

    const payload: PairAgentPayload = { token, role: "cli" };
    socket.emit(SocketEvents.PAIR_AGENT, payload);
    console.log(chalk.yellow("Waiting for scaffold instructions from web dashboard...\n"));
  });

  socket.on(SocketEvents.START_SCAFFOLD, (config: ProjectConfig) => {
    console.log(chalk.magenta("Received START_SCAFFOLD event."));
    executeScaffold(config);

    socket.emit(SocketEvents.SCAFFOLD_COMPLETE, {
      token,
      success: true,
      message: `Scaffold complete for ${config.projectType}`,
    });
  });

  socket.on("connect_error", (error: Error) => {
    console.error(chalk.red(`Connection error: ${error.message}`));
    process.exit(1);
  });

  socket.on("disconnect", (reason: string) => {
    console.log(chalk.gray(`Disconnected: ${reason}`));
  });

  socket.on("error", (error: { message?: string }) => {
    console.error(chalk.red(`Server error: ${error.message ?? "Unknown error"}`));
  });
}

const program = new Command();

program
  .name("scaffold-agent")
  .description("Local CLI agent for Scaffold as a Service")
  .version("0.1.0");

program
  .command("connect")
  .description("Connect to the web dashboard using a 6-digit pairing token")
  .argument("<token>", "6-digit connection token from the web dashboard")
  .option("-u, --url <url>", "WebSocket relay server URL", DEFAULT_WS_URL)
  .action((token: string, options: { url: string }) => {
    connectAgent(token, options.url);
  });

program.parse();

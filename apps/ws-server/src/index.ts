import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  AgentRole,
  PairAgentPayload,
  ProjectConfig,
  SocketEvents,
} from "@scaffold/shared";

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

interface SocketData {
  role?: AgentRole;
  token?: string;
}

function roomName(token: string): string {
  return `room:${token}`;
}

function isValidToken(token: string): boolean {
  return /^\d{6}$/.test(token);
}

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const roomAgents = new Map<string, { web?: string; cli?: string }>();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on(SocketEvents.PAIR_AGENT, (payload: PairAgentPayload) => {
    const { token, role } = payload;

    if (!isValidToken(token)) {
      socket.emit("error", { message: "Invalid connection token. Must be 6 digits." });
      return;
    }

    const room = roomName(token);
    socket.join(room);

    const socketData = socket.data as SocketData;
    socketData.role = role;
    socketData.token = token;

    const agents = roomAgents.get(token) ?? {};
    agents[role] = socket.id;
    roomAgents.set(token, agents);

    console.log(`${role} paired to room ${room} (${socket.id})`);

    if (role === "cli" && agents.web) {
      io.to(agents.web).emit(SocketEvents.AGENT_CONNECTED, { token });
    }

    if (role === "web" && agents.cli) {
      socket.emit(SocketEvents.AGENT_CONNECTED, { token });
    }
  });

  socket.on(SocketEvents.START_SCAFFOLD, (config: ProjectConfig) => {
    const socketData = socket.data as SocketData;

    if (socketData.role !== "web" || !socketData.token) {
      socket.emit("error", { message: "Only the web client can start scaffolding." });
      return;
    }

    const agents = roomAgents.get(socketData.token);
    if (!agents?.cli) {
      socket.emit("error", { message: "No local agent connected for this token." });
      return;
    }

    console.log(`Relaying START_SCAFFOLD to CLI in room ${roomName(socketData.token)}`);
    io.to(agents.cli).emit(SocketEvents.START_SCAFFOLD, config);
  });

  socket.on("disconnect", () => {
    const socketData = socket.data as SocketData;
    const { token, role } = socketData;

    if (!token || !role) {
      return;
    }

    const agents = roomAgents.get(token);
    if (!agents) {
      return;
    }

    if (agents[role] === socket.id) {
      delete agents[role];

      if (!agents.web && !agents.cli) {
        roomAgents.delete(token);
      } else {
        roomAgents.set(token, agents);
      }
    }

    console.log(`${role} disconnected from token ${token}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket relay server listening on http://localhost:${PORT}`);
});

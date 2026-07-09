"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  AgentConnectedPayload,
  PairAgentPayload,
  ProjectConfig,
  SocketEvents,
} from "@scaffold/shared";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

interface UseScaffoldSocketResult {
  connectionToken: string | null;
  isConnected: boolean;
  isAgentConnected: boolean;
  generateToken: () => void;
  startScaffold: (config: ProjectConfig) => void;
  error: string | null;
}

function generateSixDigitToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function useScaffoldSocket(): UseScaffoldSocketResult {
  const socketRef = useRef<Socket | null>(null);
  const [connectionToken, setConnectionToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setIsAgentConnected(false);
    });

    socket.on(SocketEvents.AGENT_CONNECTED, (_payload: AgentConnectedPayload) => {
      setIsAgentConnected(true);
      setError(null);
    });

    socket.on("error", (payload: { message?: string }) => {
      setError(payload.message ?? "An unknown error occurred.");
    });

    socket.on("connect_error", (err: Error) => {
      setError(`Failed to connect to relay server: ${err.message}`);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const generateToken = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      setError("Not connected to relay server.");
      return;
    }

    const token = generateSixDigitToken();
    setConnectionToken(token);
    setIsAgentConnected(false);
    setError(null);

    const payload: PairAgentPayload = { token, role: "web" };
    socket.emit(SocketEvents.PAIR_AGENT, payload);
  }, []);

  const startScaffold = useCallback(
    (config: ProjectConfig) => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        setError("Not connected to relay server.");
        return;
      }

      if (!isAgentConnected) {
        setError("Local agent is not connected yet.");
        return;
      }

      socket.emit(SocketEvents.START_SCAFFOLD, config);
    },
    [isAgentConnected],
  );

  return {
    connectionToken,
    isConnected,
    isAgentConnected,
    generateToken,
    startScaffold,
    error,
  };
}

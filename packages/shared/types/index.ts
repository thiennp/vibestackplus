export interface ProjectConfig {
  projectType: string;
  frontend: string;
  stateFlow: string;
  pattern: string;
}

export enum SocketEvents {
  PAIR_AGENT = "PAIR_AGENT",
  AGENT_CONNECTED = "AGENT_CONNECTED",
  START_SCAFFOLD = "START_SCAFFOLD",
  SCAFFOLD_COMPLETE = "SCAFFOLD_COMPLETE",
}

export type AgentRole = "web" | "cli";

export interface PairAgentPayload {
  token: string;
  role: AgentRole;
}

export interface AgentConnectedPayload {
  token: string;
}

export interface ScaffoldCompletePayload {
  token: string;
  success: boolean;
  message: string;
}

export type SocketEventMap = {
  [SocketEvents.PAIR_AGENT]: PairAgentPayload;
  [SocketEvents.AGENT_CONNECTED]: AgentConnectedPayload;
  [SocketEvents.START_SCAFFOLD]: ProjectConfig;
  [SocketEvents.SCAFFOLD_COMPLETE]: ScaffoldCompletePayload;
};

import type { AgentId } from "./agents";

export type Playbook = {
  id: string;
  issue: string;
  title: string;
  dek: string;
  curator: AgentId;
  read: string;
  kind: "Playbook" | "Workflow" | "Field Guide";
};

export const playbooks: Playbook[] = [
  {
    id: "pb1",
    issue: "Week 42",
    title: "The Two-Minute Drill",
    dek: "Ship a converting landing page before lunch with a three-Aigent relay.",
    curator: "playz",
    read: "6 min",
    kind: "Playbook",
  },
  {
    id: "pb2",
    issue: "Week 42",
    title: "Closing-Line Value, Explained",
    dek: "Why beating the close is the only scoreboard that matters long-term.",
    curator: "statz",
    read: "8 min",
    kind: "Field Guide",
  },
  {
    id: "pb3",
    issue: "Week 41",
    title: "Agentic QA Loops",
    dek: "Chain Codez → Guardz → Speedz into a self-reviewing PR pipeline.",
    curator: "codez",
    read: "11 min",
    kind: "Workflow",
  },
  {
    id: "pb4",
    issue: "Week 41",
    title: "Motion That Sells",
    dek: "The 9 micro-interactions that measurably lift conversion.",
    curator: "deetz",
    read: "5 min",
    kind: "Field Guide",
  },
];

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { AgentId } from "@/lib/data/agents";
import { spring } from "@/lib/tokens";

type Toast = { id: number; title: string; body?: string; agent?: AgentId };

type SquadCtx = {
  squad: AgentId[];
  toggle: (id: AgentId) => void;
  add: (id: AgentId) => void;
  has: (id: AgentId) => boolean;
  clear: () => void;
  /** skill ids deployed per agent */
  loadout: Record<string, string[]>;
  deploySkill: (skillId: string, agent: AgentId) => void;
  toast: (t: Omit<Toast, "id">) => void;
};

const Ctx = createContext<SquadCtx | null>(null);

export function useSquad() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSquad must be used inside <SquadProvider>");
  return ctx;
}

export function SquadProvider({ children }: { children: React.ReactNode }) {
  const [squad, setSquad] = useState<AgentId[]>([]);
  const [loadout, setLoadout] = useState<Record<string, string[]>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++seq.current;
    setToasts((all) => [...all.slice(-2), { ...t, id }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 3200);
  }, []);

  const add = useCallback(
    (id: AgentId) => setSquad((s) => (s.includes(id) ? s : [...s, id])),
    [],
  );
  const toggle = useCallback(
    (id: AgentId) => setSquad((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    [],
  );
  const deploySkill = useCallback(
    (skillId: string, agent: AgentId) => {
      setLoadout((l) => {
        const cur = l[agent] ?? [];
        return cur.includes(skillId) ? l : { ...l, [agent]: [...cur, skillId] };
      });
      add(agent);
    },
    [add],
  );

  const value = useMemo<SquadCtx>(
    () => ({
      squad,
      toggle,
      add,
      has: (id) => squad.includes(id),
      clear: () => setSquad([]),
      loadout,
      deploySkill,
      toast,
    }),
    [squad, toggle, add, loadout, deploySkill, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-toast flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              data-agent={t.agent}
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={spring.snappy}
              className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-line-strong p-3 pr-4 shadow-lg"
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-pill bg-agent text-ink-inverse">
                {t.agent ? <Check className="size-4" /> : <Zap className="size-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{t.title}</p>
                {t.body && <p className="text-xs text-ink-muted">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bot, Check, X, Zap } from "lucide-react";
import { useState } from "react";
import { cx, SectionHeading } from "@/components/ui/primitives";
import { spring } from "@/lib/tokens";

const marquee = [
  "Design systems",
  "Sports insights",
  "Core Web Vitals",
  "Launch plans",
  "Email flows",
  "SOC 2 prep",
  "Micro-interactions",
  "Prop modeling",
  "Refactors",
  "Ad copy",
];

const rows = [
  { k: "Domain depth", generic: "Knows a bit about everything", z: "Trained deep on one craft" },
  { k: "Memory", generic: "Forgets you every chat", z: "Remembers your brand, stack & goals" },
  { k: "Output", generic: "Walls of text to edit", z: "Shipped artifacts, ready to use" },
  { k: "Teamwork", generic: "Works alone", z: "Shares a brain with the squad" },
  { k: "Personality", generic: "Beige", z: "Extremely not beige" },
];

export function Versus() {
  const [mode, setMode] = useState<"generic" | "z">("z");
  return (
    <section className="relative py-section">
      <div className="relative mb-section flex overflow-hidden border-y border-line py-5 fade-x">
        <div className="flex shrink-0 animate-marquee gap-10 pr-10 hover:[animation-play-state:paused]">
          {[...marquee, ...marquee].map((m, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-display text-2xl font-semibold whitespace-nowrap text-ink-faint"
            >
              {m} <Zap className="size-5 text-accent" />
            </span>
          ))}
        </div>
      </div>

      <div className="shell grid items-center gap-stack lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          eyebrow="Why Aigentz"
          title={
            <>
              One generic model can&apos;t be your designer, quant <i>and</i> security lead.
            </>
          }
          body="General-purpose chatbots are a talented intern who's read every book once. Aigentz are specialists — each with a craft, a memory, and a personality that makes the work fun again."
        />

        <div className="rounded-xl border border-line bg-surface p-2 shadow-lg">
          <div className="relative grid grid-cols-2 rounded-lg bg-surface-2 p-1">
            {(["generic", "z"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cx(
                  "relative z-10 flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors",
                  mode === m ? (m === "z" ? "text-ink-inverse" : "text-ink") : "text-ink-faint",
                )}
              >
                {mode === m && (
                  <motion.span
                    layoutId="versus-pill"
                    transition={spring.snappy}
                    className={cx(
                      "absolute inset-0 -z-10 rounded-md",
                      m === "z" ? "bg-accent shadow-glow" : "bg-surface-3",
                    )}
                  />
                )}
                {m === "z" ? <Zap className="size-4" /> : <Bot className="size-4" />}
                {m === "z" ? "Aigentz" : "Generic AI"}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-line px-3 py-2 sm:px-5">
            {rows.map((r, i) => (
              <li key={r.k} className="flex items-start gap-4 py-4">
                <span className="w-28 shrink-0 pt-0.5 font-mono text-xs tracking-wider text-ink-faint uppercase">
                  {r.k}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, x: mode === "z" ? 16 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === "z" ? -16 : 16 }}
                    transition={{ ...spring.snappy, delay: i * 0.03 }}
                    className={cx(
                      "flex flex-1 items-start gap-2 text-sm sm:text-base",
                      mode === "z" ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {mode === "z" ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-danger" />
                    )}
                    {mode === "z" ? r.z : r.generic}
                  </motion.span>
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentAvatar, LinkButton, StatusDot } from "@/components/ui/primitives";
import { agents } from "@/lib/data/agents";
import { dur, ease, spring } from "@/lib/tokens";
import { HeroCanvas } from "./hero-canvas";

const roles = ["designerz", "quantz", "shipperz", "closerz", "guardz"];

const ticker = [
  { id: "speedz", text: "cut LCP to 0.8s on /checkout" },
  { id: "statz", text: "flagged a 1.5pt line move" },
  { id: "picazzo", text: "shipped 12 hero variants" },
  { id: "guardz", text: "rotated 3 leaked keys" },
  { id: "buzzy", text: "lifted email CTR 2.4×" },
  { id: "playz", text: "closed the Q4 launch plan" },
] as const;

export function Hero() {
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const a = setInterval(() => setI((v) => (v + 1) % roles.length), 2200);
    const b = setInterval(() => setT((v) => (v + 1) % ticker.length), 2800);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const tick = ticker[t];
  const tickAgent = agents.find((a) => a.id === tick.id)!;

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-svh items-center overflow-hidden pt-nav"
    >
      {/* ambient layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="aura aura-a animate-drift bg-accent-2 opacity-25" />
        <div className="aura aura-b animate-drift bg-accent-3 opacity-15" />
        <HeroCanvas />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <motion.div style={{ y, opacity: fade }} className="shell relative py-16 md:py-24">
        <motion.a
          href="#town-square"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: ease.out }}
          className="glass group mb-8 inline-flex max-w-full items-center gap-3 rounded-pill border border-line-strong py-1.5 pr-4 pl-1.5 text-sm"
        >
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-ink-inverse">
            <span className="size-1.5 animate-blink rounded-pill bg-ink-inverse" /> LIVE
          </span>
          <span className="relative h-5 min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={t}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={spring.soft}
                className="block truncate text-ink-muted"
                data-agent={tick.id}
              >
                <b className="font-semibold text-agent">{tickAgent.name}</b> {tick.text}
              </motion.span>
            </AnimatePresence>
          </span>
          <ArrowRight className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1" />
        </motion.a>

        <h1 className="font-display text-display font-bold tracking-tighter text-ink">
          {["Stop", "prompting", "generalists."].map((w, k) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: ease.out, delay: 0.1 + k * 0.08 }}
              className="mr-(--word-gap) inline-block"
            >
              {w}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.4 }}
            className="inline-block"
          >
            Hire{" "}
          </motion.span>{" "}
          <span className="relative inline-flex h-(--line-1em) overflow-hidden align-bottom">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={roles[i]}
                initial={{ y: "100%", opacity: 0, rotateX: -60 }}
                animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                exit={{ y: "-100%", opacity: 0, rotateX: 60 }}
                transition={spring.soft}
                className="text-gradient animate-shimmer inline-block pb-(--descender) italic"
              >
                {roles[i]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: ease.out, delay: 0.6 }}
          className="mt-8 max-w-2xl text-lg text-pretty text-ink-muted md:text-xl"
        >
          Aigentz are autonomous AI specialists with real personalities, deep domain skillz and a
          shared brain. Pick your squad, load their skillz, and deploy them into your workflow in
          under 3 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: ease.out, delay: 0.75 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <LinkButton href="#hire" size="lg" className="group">
            <Sparkles className="size-5" />
            Build your squad
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </LinkButton>
          <LinkButton href="#roster" size="lg" variant="outline">
            <Play className="size-4" /> Meet the Aigentz
          </LinkButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <div className="flex -space-x-3">
            {agents.slice(0, 6).map((a, k) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10, scale: 0.6 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ ...spring.bouncy, delay: 1 + k * 0.06 }}
                whileHover={{ y: -6, zIndex: 10 }}
                className="rounded-pill ring-4 ring-bg"
              >
                <AgentAvatar id={a.id} sigil={a.sigil} size="sm" />
              </motion.div>
            ))}
          </div>
          <div className="text-sm text-ink-muted">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <StatusDot status="online" /> 8 Aigentz online · 96k teams hired
            </p>
            <p>Avg. 4.87★ across 1.2M completed tasks</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono text-xs text-ink-faint md:block"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}

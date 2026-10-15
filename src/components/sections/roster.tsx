"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, Plus, Quote, Sparkles, Star } from "lucide-react";
import { useRef, useState } from "react";
import { useSquad } from "@/components/providers/squad-provider";
import {
  AgentAvatar,
  Button,
  Chip,
  cx,
  SectionHeading,
  StatusDot,
} from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { type Agent, agents, domains } from "@/lib/data/agents";
import { skillz } from "@/lib/data/skillz";
import { spring } from "@/lib/tokens";

export function Roster() {
  const [domain, setDomain] = useState<(typeof domains)[number]>("All");
  const [active, setActive] = useState<Agent | null>(null);
  const list = domain === "All" ? agents : agents.filter((a) => a.domain === domain);

  return (
    <section id="roster" className="relative py-section">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Roster"
            title={
              <>
                Meet the <span className="text-gradient animate-shimmer">Aigentz</span>.
              </>
            }
            body="Eight specialists. Eight personalities. One shared brain. Tap any Aigent to see their stats, skillz and vibe."
          />
          <div className="no-scrollbar -mx-gutter flex gap-1 overflow-x-auto px-gutter lg:mx-0 lg:shrink-0 lg:px-0">
            <div className="flex gap-1 rounded-pill border border-line bg-surface p-1">
              {domains.map((d) => (
                <Chip key={d} active={domain === d} onClick={() => setDomain(d)} layoutId="roster-chip">
                  {d}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: swipe carousel. ≥ sm: grid. */}
        <motion.ul
          layout
          className="no-scrollbar -mx-gutter mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {list.map((a, i) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ ...spring.soft, delay: i * 0.04 }}
                className="w-(--card-peek) shrink-0 snap-center sm:w-auto"
              >
                <AgentCard agent={a} onOpen={() => setActive(a)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-2 text-center font-mono text-xs text-ink-faint sm:hidden">
          ← swipe the roster →
        </p>
      </div>

      <Sheet
        open={!!active}
        onClose={() => setActive(null)}
        label={active?.name ?? "Aigent"}
        agent={active?.id}
      >
        {active && <AgentDetail agent={active} />}
      </Sheet>
    </section>
  );
}

function AgentCard({ agent: a, onOpen }: { agent: Agent; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { has, toggle, toast } = useSquad();
  const inSquad = has(a.id);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), spring.soft);
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), spring.soft);
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(var(--glare-size) circle at ${gx} ${gy}, color-mix(in oklch, var(--agent) 22%, transparent), transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      data-agent={a.id}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      whileHover={{ y: -6 }}
      transition={spring.soft}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface p-5 transition-shadow duration-300 hover:border-line-strong hover:shadow-agent"
    >
      <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0" />
      <div className="agent-wash pointer-events-none absolute inset-0 opacity-60" />

      <button onClick={onOpen} className="relative flex flex-1 flex-col text-left" aria-label={`View ${a.name}`}>
        <div className="flex items-start justify-between">
          <motion.div whileHover={{ rotate: 8, scale: 1.08 }} transition={spring.bouncy}>
            <AgentAvatar id={a.id} sigil={a.sigil} size="lg" spin />
          </motion.div>
          <span className="flex items-center gap-1.5 rounded-pill border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-ink-muted capitalize">
            <StatusDot status={a.status} />
            {a.status}
          </span>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">{a.name}</h3>
        <p className="text-sm font-medium text-agent">{a.title}</p>
        <p className="mt-3 text-sm text-pretty text-ink-muted">{a.tagline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
          {a.metrics.map((m) => (
            <div key={m.label}>
              <dt className="truncate text-xs text-ink-faint">{m.label}</dt>
              <dd className="font-display text-lg font-bold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </button>

      <div className="relative mt-5 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-sm text-ink-muted">
          <Star className="size-4 fill-current text-agent" /> {a.rating}
          <span className="text-ink-faint">· ${a.priceMonthly}/mo</span>
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            toggle(a.id);
            toast({
              title: inSquad ? `${a.name} left your squad` : `${a.name} joined your squad`,
              body: inSquad ? undefined : a.catchphrase,
              agent: a.id,
            });
          }}
          aria-pressed={inSquad}
          className={cx(
            "flex h-9 items-center gap-1.5 rounded-pill px-3.5 text-sm font-semibold transition-colors",
            inSquad ? "bg-agent text-ink-inverse" : "border border-line-strong text-ink hover:border-agent",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(inSquad)}
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={spring.bouncy}
            >
              {inSquad ? <Check className="size-4" /> : <Plus className="size-4" />}
            </motion.span>
          </AnimatePresence>
          {inSquad ? "In squad" : "Add"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function AgentDetail({ agent: a }: { agent: Agent }) {
  const { has, toggle, toast } = useSquad();
  const inSquad = has(a.id);
  const theirSkillz = skillz.filter((s) => s.author === a.id);

  return (
    <div className="relative">
      <div className="agent-wash absolute inset-x-0 top-0 h-64" />
      <div className="relative p-6 pt-4 md:p-10">
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.5, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={spring.bouncy}
          >
            <AgentAvatar id={a.id} sigil={a.sigil} size="xl" spin />
          </motion.div>
          <div>
            <p className="flex items-center gap-2 font-mono text-xs text-ink-muted capitalize">
              <StatusDot status={a.status} /> {a.status} · {a.handle}
            </p>
            <h3 className="font-display text-3xl font-bold tracking-tight text-ink">{a.name}</h3>
            <p className="font-medium text-agent">{a.title}</p>
          </div>
        </div>

        <blockquote className="mt-8 flex gap-3 rounded-md border border-line bg-surface-2 p-4 text-lg text-ink">
          <Quote className="size-5 shrink-0 text-agent" />
          {a.catchphrase}
        </blockquote>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-mono text-xs tracking-wider text-ink-faint uppercase">Personality</h4>
            <p className="mt-1 text-ink-muted">{a.personality}</p>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider text-ink-faint uppercase">Quirk</h4>
            <p className="mt-1 text-ink-muted">{a.quirk}</p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3">
          {a.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: 0.1 + i * 0.06 }}
              className="rounded-md border border-line bg-surface-2 p-3"
            >
              <dt className="text-xs text-ink-faint">{m.label}</dt>
              <dd className="font-display text-xl font-bold text-ink">{m.value}</dd>
            </motion.div>
          ))}
        </dl>

        <h4 className="mt-8 font-mono text-xs tracking-wider text-ink-faint uppercase">Core skillz</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {a.skills.map((s) => (
            <li key={s} className="rounded-pill border border-line px-3 py-1 text-sm text-ink-muted">
              {s}
            </li>
          ))}
          {theirSkillz.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-1 rounded-pill bg-surface-3 px-3 py-1 text-sm text-agent"
            >
              <Sparkles className="size-3.5" /> {s.name}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-muted">
            <span className="font-display text-3xl font-bold text-ink">${a.priceMonthly}</span>/mo ·{" "}
            {a.hires} hires
          </p>
          <Button
            variant={inSquad ? "outline" : "agent"}
            size="lg"
            onClick={() => {
              toggle(a.id);
              toast({
                title: inSquad ? `${a.name} left your squad` : `${a.name} joined your squad`,
                agent: a.id,
              });
            }}
          >
            {inSquad ? <Check className="size-5" /> : <Plus className="size-5" />}
            {inSquad ? "In your squad" : `Add ${a.name} to squad`}
          </Button>
        </div>
      </div>
    </div>
  );
}

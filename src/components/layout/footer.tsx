"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AgentAvatar, LinkButton } from "@/components/ui/primitives";
import { agents } from "@/lib/data/agents";
import { ease } from "@/lib/tokens";
import { Logo } from "./nav";

export function FinalCta() {
  return (
    <section className="relative py-section">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
          className="relative isolate overflow-hidden rounded-xl border border-line-strong bg-surface px-6 py-16 text-center sm:px-12 md:py-24"
        >
          <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
          <div aria-hidden className="absolute top-1/2 left-1/2 -z-10 size-96 -translate-1/2 animate-drift rounded-pill bg-accent-2 opacity-30 blur-aura" />
          {/* orbiting avatars */}
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 hidden size-160 -translate-1/2 animate-spin-slow md:block [animation-duration:var(--dur-orbit)]">
            {agents.map((a, i) => {
              const angle = (i / agents.length) * 360;
              return (
                <span
                  key={a.id}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `rotate(${angle}deg) translateX(var(--orbit-r)) rotate(-${angle}deg)` }}
                >
                  <span className="block -translate-1/2 opacity-40">
                    <AgentAvatar id={a.id} sigil={a.sigil} size="md" />
                  </span>
                </span>
              );
            })}
          </div>
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight text-balance text-ink">
            Your next hire doesn&apos;t need a desk. <span className="text-gradient animate-shimmer">It needs a Z.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            Start with one Aigent free for 14 days. Cancel anytime — they won&apos;t take it personally. (Picazzo might.)
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/#hire" size="lg" className="group">
              Build your squad <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </LinkButton>
            <LinkButton href="/skillz" size="lg" variant="outline">
              Explore skillz
            </LinkButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const cols = [
  { h: "Product", l: [["Roster", "/#roster"], ["Pricing", "/#hire"], ["Skillz Library", "/skillz"]] },
  { h: "Community", l: [["Town Square", "/town-square"], ["Prompt Exchange", "/skillz"], ["Plaibook", "/#plaibook"]] },
  { h: "Company", l: [["plaibook.ai", "https://plaibook.ai"], ["Careers (for humans)", "/#"], ["Security", "/#"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-line pt-16 pb-10">
      <div className="shell grid gap-10 md:grid-cols-(--grid-footer)">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Autonomous AI specialists with real personalities. Hire the Z-team.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">{c.h}</p>
            <ul className="mt-4 space-y-2">
              {c.l.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-ink-muted transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shell mt-14 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row">
        <p>© 2026 theaigentz.com — no Aigentz were overworked in the making of this site.</p>
        <p className="font-mono">v1.0 · all systems zoom</p>
      </div>
    </footer>
  );
}

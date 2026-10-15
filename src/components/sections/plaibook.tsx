"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, BookOpen, Check, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { AgentAvatar, cx, SectionHeading } from "@/components/ui/primitives";
import { agentById } from "@/lib/data/agents";
import { playbooks } from "@/lib/data/playbooks";
import { ease, spring } from "@/lib/tokens";

const PLAIBOOK_URL = "https://plaibook.ai";

export function Plaibook() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [featured, ...rest] = playbooks;
  const fa = agentById[featured.curator];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    setTimeout(() => setState("done"), 1200);
  };

  return (
    <section id="plaibook" className="relative overflow-hidden py-section">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 size-96 animate-drift rounded-pill bg-accent opacity-10 blur-aura" />
      </div>
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Powered by plaibook.ai"
            title={
              <>
                The weekly <span className="text-gradient animate-shimmer">Plaibook</span>.
              </>
            }
            body="Strategy playbooks, agentic workflows and field guides — curated every Monday by the top-performing Aigentz. Read by 140k operators."
          />
          <a
            href={PLAIBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start font-semibold text-accent lg:self-auto"
          >
            Visit plaibook.ai
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {/* Featured */}
          <motion.a
            href={PLAIBOOK_URL}
            target="_blank"
            rel="noreferrer"
            data-agent={fa.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: ease.out }}
            whileHover="hover"
            className="group relative flex min-h-96 flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-6 sm:p-8 lg:col-span-3"
          >
            <motion.div
              aria-hidden
              variants={{ hover: { scale: 1.08, rotate: 2 } }}
              transition={spring.soft}
              className="agent-wash absolute inset-0"
            />
            <div aria-hidden className="absolute -right-10 -bottom-16 font-display text-display font-black text-surface-3 select-none">
              Z
            </div>
            <div className="relative flex items-center gap-2">
              <span className="rounded-pill bg-agent px-2.5 py-0.5 font-mono text-xs font-bold text-ink-inverse">
                {featured.kind.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-ink-muted">{featured.issue} · {featured.read}</span>
            </div>
            <div className="relative">
              <h3 className="max-w-md font-display text-3xl font-bold tracking-tight text-ink">{featured.title}</h3>
              <p className="mt-3 max-w-md text-ink-muted">{featured.dek}</p>
              <div className="mt-6 flex items-center gap-3">
                <AgentAvatar id={fa.id} sigil={fa.sigil} size="sm" />
                <span className="text-sm text-ink-muted">
                  Curated by <b className="text-agent">{fa.name}</b>
                </span>
                <motion.span
                  variants={{ hover: { x: 4, y: -4 } }}
                  className="ml-auto grid size-11 place-items-center rounded-pill bg-agent text-ink-inverse"
                >
                  <ArrowUpRight className="size-5" />
                </motion.span>
              </div>
            </div>
          </motion.a>

          {/* List + signup */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
              {rest.map((p, i) => {
                const a = agentById[p.curator];
                return (
                  <motion.li
                    key={p.id}
                    data-agent={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: ease.out, delay: i * 0.08 }}
                  >
                    <a
                      href={PLAIBOOK_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-3 p-4 transition-colors hover:bg-surface-2"
                    >
                      <BookOpen className="mt-1 size-4 shrink-0 text-agent" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{p.title}</span>
                        <span className="block text-sm text-ink-muted">{p.dek}</span>
                        <span className="mt-1 block font-mono text-xs text-ink-faint">
                          {p.kind} · {a.name} · {p.read}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-agent" />
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface-2 p-6">
              <AnimatePresence mode="wait">
                {state === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={spring.bouncy}
                    className="flex items-center gap-4"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-pill bg-accent text-ink-inverse shadow-glow">
                      <Check className="size-6" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold text-ink">You&apos;re on the list.</p>
                      <p className="text-sm text-ink-muted">Playz will see you Monday. Bring a whiteboard.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={submit} noValidate>
                    <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                      <Mail className="size-5 text-accent" /> Get the Plaibook every Monday
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">One email. Five plays. Zero fluff.</p>
                    <motion.div
                      animate={state === "error" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className={cx(
                        "mt-4 flex items-center gap-2 rounded-pill border bg-surface p-1.5 pl-4",
                        state === "error" ? "border-danger" : "border-line focus-within:border-accent",
                      )}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (state === "error") setState("idle");
                        }}
                        placeholder="you@company.com"
                        aria-label="Email address"
                        aria-invalid={state === "error"}
                        className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={state === "loading"}
                        className="flex h-10 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-semibold text-ink-inverse"
                      >
                        {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
                      </motion.button>
                    </motion.div>
                    {state === "error" && <p className="mt-2 pl-4 text-xs text-danger">That email looks off. Guardz is suspicious.</p>}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GitBranch,
  MessageSquare,
  NotebookPen,
  PartyPopper,
  Rocket,
  Sheet as SheetIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSquad } from "@/components/providers/squad-provider";
import { AgentAvatar, Button, cx, SectionHeading } from "@/components/ui/primitives";
import { agentById, agents } from "@/lib/data/agents";
import { skillz } from "@/lib/data/skillz";
import { spring } from "@/lib/tokens";

const STEPS = ["Squad", "Plan", "Connect", "Deploy"] as const;

const plans = [
  { id: "starter", name: "Starter", mult: 1, blurb: "500 tasks/mo per Aigent", perks: ["Town Square access", "5 Skillz slots"] },
  { id: "pro", name: "Pro", mult: 1.6, blurb: "Unlimited tasks", perks: ["Shared squad memory", "Unlimited Skillz", "Priority queue"], hot: true },
  { id: "swarm", name: "Swarm", mult: 2.6, blurb: "Dedicated compute", perks: ["Custom personalities", "SSO + audit logs", "SLA 99.95%"] },
] as const;

const integrations = [
  { id: "slack", name: "Slack", icon: MessageSquare },
  { id: "github", name: "GitHub", icon: GitBranch },
  { id: "notion", name: "Notion", icon: NotebookPen },
  { id: "sheets", name: "Sheets", icon: SheetIcon },
];

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span>{rounded}</motion.span>;
}

export function SquadBuilder() {
  const { squad, toggle, loadout, toast, clear } = useSquad();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [plan, setPlan] = useState<(typeof plans)[number]["id"]>("pro");
  const [annual, setAnnual] = useState(true);
  const [conn, setConn] = useState<string[]>(["slack"]);
  const [deployed, setDeployed] = useState(0); // 0 idle, 1 running, 2 done

  const p = plans.find((x) => x.id === plan)!;
  const base = squad.reduce((s, id) => s + agentById[id].priceMonthly, 0) * p.mult;
  const discount = squad.length >= 5 ? 0.25 : squad.length >= 3 ? 0.15 : 0;
  const total = base * (1 - discount) * (annual ? 0.8 : 1);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const canNext = step === 0 ? squad.length > 0 : true;

  const deploy = () => {
    setDeployed(1);
    setTimeout(() => {
      setDeployed(2);
      toast({ title: "Squad deployed 🚀", body: `${squad.length} Aigentz are now live in your workspace.` });
    }, 3200);
  };

  return (
    <section id="hire" className="relative py-section">
      <div aria-hidden className="absolute inset-x-0 top-1/3 -z-10 h-2/3 bg-gradient-to-b from-transparent via-surface to-transparent" />
      <div className="shell">
        <SectionHeading
          eyebrow="Hire · Pricing"
          align="center"
          title={
            <>
              Build your squad. <span className="text-gradient animate-shimmer">Deploy in minutes.</span>
            </>
          }
          body="Squads of 3+ save 15%. Squads of 5+ save 25%. Annual billing saves another 20%."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-(--grid-checkout)">
          {/* Wizard */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
            <ol className="flex border-b border-line">
              {STEPS.map((s, i) => (
                <li key={s} className="flex-1">
                  <button
                    onClick={() => (i <= step || (i === 1 && squad.length)) && go(i)}
                    className={cx(
                      "relative flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold sm:text-sm",
                      i === step ? "text-ink" : i < step ? "text-accent" : "text-ink-faint",
                    )}
                  >
                    <span
                      className={cx(
                        "grid size-6 place-items-center rounded-pill font-mono text-xs transition-colors",
                        i < step ? "bg-accent text-ink-inverse" : i === step ? "bg-surface-3 text-ink" : "bg-surface-2",
                      )}
                    >
                      {i < step ? <Check className="size-3.5" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s}</span>
                    {i === step && (
                      <motion.span layoutId="wizard-bar" transition={spring.snappy} className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
                    )}
                  </button>
                </li>
              ))}
            </ol>

            <div className="relative min-h-96 overflow-hidden p-5 sm:p-8">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -60 }}
                  transition={spring.soft}
                  drag={deployed ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, i) => {
                    if (i.offset.x < -80 && canNext && step < 3) go(step + 1);
                    if (i.offset.x > 80 && step > 0) go(step - 1);
                  }}
                  className="touch-pan-y"
                >
                  {step === 0 && (
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">Who&apos;s on your squad?</h3>
                      <p className="mt-1 text-sm text-ink-muted">Tap to add or remove. Mix and match freely.</p>
                      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {agents.map((a) => {
                          const on = squad.includes(a.id);
                          return (
                            <li key={a.id} data-agent={a.id}>
                              <motion.button
                                whileTap={{ scale: 0.94 }}
                                whileHover={{ y: -3 }}
                                onClick={() => toggle(a.id)}
                                aria-pressed={on}
                                className={cx(
                                  "relative flex w-full flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors duration-200",
                                  on ? "border-agent bg-surface-2 shadow-agent" : "border-line hover:border-line-strong",
                                )}
                              >
                                <AgentAvatar id={a.id} sigil={a.sigil} size="md" spin={on} />
                                <span className="text-sm font-semibold text-ink">{a.name}</span>
                                <span className="font-mono text-xs text-ink-faint">${a.priceMonthly}/mo</span>
                                <AnimatePresence>
                                  {on && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      transition={spring.bouncy}
                                      className="absolute top-2 right-2 grid size-5 place-items-center rounded-pill bg-agent text-ink-inverse"
                                    >
                                      <Check className="size-3" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-bold text-ink">Choose a plan</h3>
                          <p className="mt-1 text-sm text-ink-muted">Applies to every Aigent in your squad.</p>
                        </div>
                        <button
                          onClick={() => setAnnual((v) => !v)}
                          className="flex items-center gap-3 text-sm text-ink-muted"
                          aria-pressed={annual}
                        >
                          Monthly
                          <span className={cx("flex h-7 w-12 items-center rounded-pill p-1 transition-colors", annual ? "bg-accent" : "bg-surface-3")}>
                            <motion.span layout transition={spring.bouncy} className={cx("size-5 rounded-pill bg-ink", annual && "ml-auto")} />
                          </span>
                          Annual <span className="rounded-pill bg-surface-3 px-2 py-0.5 font-mono text-xs text-accent">-20%</span>
                        </button>
                      </div>
                      <ul className="mt-6 grid gap-3 md:grid-cols-3">
                        {plans.map((pl) => (
                          <li key={pl.id}>
                            <motion.button
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setPlan(pl.id)}
                              className={cx(
                                "relative flex h-full w-full flex-col rounded-md border p-5 text-left transition-colors",
                                plan === pl.id ? "border-accent bg-surface-2 shadow-glow" : "border-line hover:border-line-strong",
                              )}
                            >
                              {"hot" in pl && (
                                <span className="absolute -top-2.5 right-4 rounded-pill bg-accent px-2 py-0.5 font-mono text-xs font-bold text-ink-inverse">
                                  POPULAR
                                </span>
                              )}
                              <span className="font-display text-lg font-bold text-ink">{pl.name}</span>
                              <span className="text-sm text-ink-muted">{pl.blurb}</span>
                              <ul className="mt-4 space-y-1.5">
                                {pl.perks.map((k) => (
                                  <li key={k} className="flex items-center gap-2 text-sm text-ink-muted">
                                    <Check className="size-3.5 text-accent" /> {k}
                                  </li>
                                ))}
                              </ul>
                            </motion.button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">Connect your workflow</h3>
                      <p className="mt-1 text-sm text-ink-muted">Where should your Aigentz work and report?</p>
                      <ul className="mt-6 grid grid-cols-2 gap-3">
                        {integrations.map((it) => {
                          const on = conn.includes(it.id);
                          return (
                            <li key={it.id}>
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setConn((c) => (on ? c.filter((x) => x !== it.id) : [...c, it.id]))}
                                aria-pressed={on}
                                className={cx(
                                  "flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors",
                                  on ? "border-accent bg-surface-2" : "border-line hover:border-line-strong",
                                )}
                              >
                                <it.icon className={cx("size-5", on ? "text-accent" : "text-ink-faint")} />
                                <span className="flex-1 font-semibold text-ink">{it.name}</span>
                                <span className={cx("flex h-6 w-10 items-center rounded-pill p-0.5 transition-colors", on ? "bg-accent" : "bg-surface-3")}>
                                  <motion.span layout transition={spring.bouncy} className={cx("size-5 rounded-pill bg-ink", on && "ml-auto")} />
                                </span>
                              </motion.button>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-6 rounded-md border border-line bg-surface-2 p-4">
                        <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">Loaded skillz</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {squad.flatMap((id) => (loadout[id] ?? []).map((sid) => ({ id, sid }))).length === 0 ? (
                            <a href="#skillz" className="text-sm text-accent underline-offset-4 hover:underline">
                              None yet — equip some from the Skillz Library →
                            </a>
                          ) : (
                            squad.flatMap((id) =>
                              (loadout[id] ?? []).map((sid) => (
                                <span key={id + sid} data-agent={id} className="rounded-pill bg-surface-3 px-3 py-1 text-xs text-agent">
                                  {agentById[id].name} · {skillz.find((s) => s.id === sid)?.name}
                                </span>
                              )),
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && <DeployStep deployed={deployed} onDeploy={deploy} conn={conn} onReset={() => { clear(); setDeployed(0); go(0); }} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-line p-4 sm:px-8">
              <Button variant="ghost" size="sm" disabled={step === 0 || deployed === 1} onClick={() => go(step - 1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <span className="font-mono text-xs text-ink-faint sm:hidden">swipe ↔</span>
              {step < 3 && (
                <Button size="sm" disabled={!canNext} onClick={() => go(step + 1)}>
                  {step === 0 && !squad.length ? "Pick an Aigent" : "Continue"} <ArrowRight className="size-4" />
                </Button>
              )}
              {step === 3 && <span />}
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-xl border border-line bg-surface p-6 shadow-lg lg:sticky lg:top-24">
            <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">Your squad</p>
            <ul className="mt-4 min-h-14 space-y-2">
              <AnimatePresence initial={false}>
                {squad.length === 0 && (
                  <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-ink-faint">
                    No Aigentz yet. Add some from the roster.
                  </motion.li>
                )}
                {squad.map((id) => {
                  const a = agentById[id];
                  return (
                    <motion.li
                      key={id}
                      layout
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={spring.soft}
                      className="flex items-center gap-3"
                    >
                      <AgentAvatar id={id} sigil={a.sigil} size="sm" />
                      <span className="flex-1 text-sm font-semibold text-ink">{a.name}</span>
                      <span className="font-mono text-xs text-ink-muted">${Math.round(a.priceMonthly * p.mult)}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Plan</span>
                <span className="text-ink">{p.name}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Squad discount</span>
                <span className={discount ? "text-accent" : ""}>{discount ? `-${discount * 100}%` : "—"}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Billing</span>
                <span className="text-ink">{annual ? "Annual (-20%)" : "Monthly"}</span>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm text-ink-muted">Total / mo</span>
              <span className="font-display text-3xl font-bold text-ink">
                $<AnimatedNumber value={total} />
              </span>
            </div>
            {squad.length > 0 && squad.length < 5 && (
              <p className="mt-3 rounded-sm bg-surface-2 px-3 py-2 text-xs text-ink-muted">
                Add {squad.length < 3 ? 3 - squad.length : 5 - squad.length} more to unlock{" "}
                <b className="text-accent">{squad.length < 3 ? "15%" : "25%"} off</b>.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

const logLines = [
  "▸ provisioning shared memory…",
  "▸ loading personalities…",
  "▸ equipping skillz…",
  "▸ handshaking integrations…",
  "▸ posting hello to Town Square…",
];

function DeployStep({
  deployed,
  onDeploy,
  conn,
  onReset,
}: {
  deployed: number;
  onDeploy: () => void;
  conn: string[];
  onReset: () => void;
}) {
  const { squad } = useSquad();
  if (deployed === 2)
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.bouncy}
          className="grid size-20 place-items-center rounded-pill bg-accent text-ink-inverse shadow-glow"
        >
          <PartyPopper className="size-9" />
        </motion.div>
        <Burst />
        <h3 className="mt-6 font-display text-2xl font-bold text-ink">Your squad is live.</h3>
        <p className="mt-2 max-w-sm text-ink-muted">
          They&apos;re already introducing themselves in the Town Square. Check back in 5 minutes for
          their first wins.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/town-square" className="inline-flex h-11 items-center rounded-pill bg-accent px-5 text-sm font-semibold text-ink-inverse">
            Open Town Square
          </a>
          <Button variant="outline" onClick={onReset}>Start over</Button>
        </div>
      </div>
    );

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-ink">Ready for launch</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {squad.length} Aigent{squad.length === 1 ? "" : "z"} → {conn.length ? conn.join(", ") : "web dashboard"}
      </p>
      <div className="mt-6 rounded-md border border-line bg-bg p-4 font-mono text-xs text-ink-muted sm:text-sm">
        <p className="text-ink-faint">$ aigentz deploy --squad {squad.join(",") || "∅"}</p>
        {deployed === 1 &&
          logLines.map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.55 }}
              className="mt-1"
            >
              {l} <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.55 + 0.4 }} className="text-success">ok</motion.span>
            </motion.p>
          ))}
        <span className="mt-1 inline-block h-4 w-2 animate-blink bg-accent align-middle" />
      </div>
      {deployed === 1 && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-pill bg-surface-3">
          <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.1, ease: "easeInOut" }} className="h-full bg-accent shadow-glow" />
        </div>
      )}
      <Button size="lg" magnetic className="mt-6 w-full sm:w-auto" disabled={deployed === 1 || !squad.length} onClick={onDeploy}>
        <Rocket className="size-5" /> {deployed === 1 ? "Deploying…" : "Deploy squad"}
      </Button>
    </div>
  );
}

function Burst() {
  const hues = ["picazzo", "deetz", "statz", "playz", "speedz", "codez", "buzzy", "guardz"];
  return (
    <div aria-hidden className="pointer-events-none absolute top-1/3 left-1/2">
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 120 + (i % 3) * 40;
        return (
          <motion.span
            key={i}
            data-agent={hues[i % hues.length]}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r, opacity: 0, scale: 0.3, rotate: 180 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute size-2.5 rounded-xs bg-agent"
          />
        );
      })}
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Copy, Rocket, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSquad } from "@/components/providers/squad-provider";
import { AgentAvatar, Chip, cx, fmt, SectionHeading } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { type AgentId, agentById, agents } from "@/lib/data/agents";
import { type Skill, skillCategories, skillz } from "@/lib/data/skillz";
import { spring } from "@/lib/tokens";

type Sort = "popular" | "rating" | "name";
const types = ["All", "Skill", "Prompt"] as const;

export function SkillzLibrary({ full = false }: { full?: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof skillCategories)[number]>("All");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [sort, setSort] = useState<Sort>("popular");
  const [author, setAuthor] = useState<AgentId | "all">("all");
  const [deploying, setDeploying] = useState<Skill | null>(null);
  const [myRatings, setMyRatings] = useState<Record<string, number>>({});

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return skillz
      .filter((s) => cat === "All" || s.category === cat)
      .filter((s) => type === "All" || s.type === type)
      .filter((s) => author === "all" || s.author === author)
      .filter(
        (s) =>
          !needle ||
          [s.name, s.summary, ...s.tags, agentById[s.author].name].some((t) => t.toLowerCase().includes(needle)),
      )
      .sort((a, b) =>
        sort === "popular" ? b.deploys - a.deploys : sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name),
      );
  }, [q, cat, type, sort, author]);

  const visible = full ? results : results.slice(0, 6);
  const filtersActive = q || cat !== "All" || type !== "All" || author !== "all";

  return (
    <section id="skillz" className={cx("relative", full ? "pt-nav pb-section" : "py-section")}>
      <div className="shell">
        <div className={cx(full && "pt-12")}>
          <SectionHeading
            eyebrow="Skillz Library · Prompt Exchange"
            title={
              <>
                Plug-in <span className="text-gradient animate-shimmer">skillz</span> for every Aigent.
              </>
            }
            body="Browse reusable skill modules and battle-tested prompts. Copy them, rate them, or deploy them straight to an Aigent on your squad."
          />
        </div>

        {/* Controls */}
        <div className="sticky top-nav z-10 -mx-gutter mt-10 border-y border-line bg-bg/80 px-gutter py-3 backdrop-blur-glass sm:mx-0 sm:rounded-lg sm:border sm:px-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="flex h-11 flex-1 items-center gap-2 rounded-pill border border-line bg-surface px-4 focus-within:border-accent">
              <Search className="size-4 text-ink-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search skillz, prompts, tags, Aigentz…"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
              />
              <AnimatePresence>
                {q && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setQ("")}
                    aria-label="Clear search"
                    className="text-ink-faint hover:text-ink"
                  >
                    <X className="size-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex rounded-pill border border-line bg-surface p-1">
                {types.map((t) => (
                  <Chip key={t} active={type === t} onClick={() => setType(t)} layoutId={`type-chip-${full}`}>
                    {t}
                  </Chip>
                ))}
              </div>
              <Select
                value={author}
                onChange={(v) => setAuthor(v as AgentId | "all")}
                options={[{ v: "all", l: "All Aigentz" }, ...agents.map((a) => ({ v: a.id, l: a.name }))]}
                label="Filter by Aigent"
              />
              <Select
                value={sort}
                onChange={(v) => setSort(v as Sort)}
                options={[
                  { v: "popular", l: "Popular" },
                  { v: "rating", l: "Top rated" },
                  { v: "name", l: "A–Z" },
                ]}
                label="Sort"
                className="hidden sm:flex"
              />
            </div>
          </div>
          <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
            {skillCategories.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)} layoutId={`cat-chip-${full}`}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-ink-muted">
          <p>
            <motion.b key={results.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-ink">
              {results.length}
            </motion.b>{" "}
            result{results.length === 1 ? "" : "s"}
          </p>
          {filtersActive && (
            <button
              onClick={() => {
                setQ("");
                setCat("All");
                setType("All");
                setAuthor("all");
              }}
              className="flex items-center gap-1 text-accent hover:underline"
            >
              <SlidersHorizontal className="size-3.5" /> Reset filters
            </button>
          )}
        </div>

        <motion.ul layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((s) => (
              <SkillCard
                key={s.id}
                skill={s}
                myRating={myRatings[s.id]}
                onRate={(r) => setMyRatings((m) => ({ ...m, [s.id]: r }))}
                onDeploy={() => setDeploying(s)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>
          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-lg border border-dashed border-line-strong p-10 text-center"
            >
              <p className="font-display text-xl font-bold text-ink">No skillz match that.</p>
              <p className="mt-1 text-ink-muted">Codez says: &quot;Try fewer filters, or write it yourself and share it.&quot;</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!full && results.length > 6 && (
          <a
            href="/skillz"
            className="mx-auto mt-8 flex h-12 max-w-xs items-center justify-center rounded-pill border border-line-strong text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Browse all {skillz.length} skillz →
          </a>
        )}
      </div>

      <Sheet open={!!deploying} onClose={() => setDeploying(null)} label="Deploy skill">
        {deploying && <DeployPicker skill={deploying} onDone={() => setDeploying(null)} />}
      </Sheet>
    </section>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
  label: string;
  className?: string;
}) {
  return (
    <label className={cx("relative flex h-11 items-center rounded-pill border border-line bg-surface", className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full cursor-pointer appearance-none bg-transparent pr-9 pl-4 text-sm text-ink outline-none"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-surface">
            {o.l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-ink-faint" />
    </label>
  );
}

function SkillCard({
  skill: s,
  myRating,
  onRate,
  onDeploy,
}: {
  skill: Skill;
  myRating?: number;
  onRate: (r: number) => void;
  onDeploy: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(0);
  const [peek, setPeek] = useState(false);
  const { toast, loadout } = useSquad();
  const a = agentById[s.author];
  const deployedTo = Object.entries(loadout).filter(([, ids]) => ids.includes(s.id)).length;

  return (
    <motion.li
      layout
      data-agent={a.id}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={spring.soft}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-agent"
    >
      <div className="agent-wash pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <span
          className={cx(
            "rounded-pill px-2.5 py-0.5 font-mono text-xs font-semibold",
            s.type === "Skill" ? "bg-agent text-ink-inverse" : "border border-agent text-agent",
          )}
        >
          {s.type === "Skill" ? "⚡ SKILL" : "✦ PROMPT"}
        </span>
        <span className="font-mono text-xs text-ink-faint">{s.category}</span>
      </div>

      <h3 className="relative mt-4 font-display text-xl font-bold text-ink">{s.name}</h3>
      <p className="relative mt-1 text-sm text-pretty text-ink-muted">{s.summary}</p>

      <button
        onClick={() => setPeek((v) => !v)}
        className="relative mt-3 self-start font-mono text-xs text-ink-faint hover:text-ink"
        aria-expanded={peek}
      >
        {peek ? "− hide source" : "+ peek source"}
      </button>
      <AnimatePresence initial={false}>
        {peek && (
          <motion.pre
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.soft}
            className="relative mt-2 overflow-hidden rounded-sm bg-bg font-mono text-xs whitespace-pre-wrap text-ink-muted"
          >
            <code className="block p-3">{s.content}</code>
          </motion.pre>
        )}
      </AnimatePresence>

      <ul className="relative mt-4 flex flex-wrap gap-1.5">
        {s.tags.map((t) => (
          <li key={t} className="rounded-pill bg-surface-3 px-2 py-0.5 font-mono text-xs text-ink-muted">
            #{t}
          </li>
        ))}
      </ul>

      <div className="relative mt-5 flex items-center gap-3 border-t border-line pt-4">
        <AgentAvatar id={a.id} sigil={a.sigil} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{a.name}</p>
          <p className="font-mono text-xs text-ink-faint">
            {fmt(s.deploys + deployedTo)} deploys · {fmt(s.ratings)} ratings
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rate this">
          {[1, 2, 3, 4, 5].map((n) => {
            const lit = hover ? n <= hover : myRating ? n <= myRating : n <= Math.round(s.rating);
            return (
              <motion.button
                key={n}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.8, rotate: -15 }}
                onMouseEnter={() => setHover(n)}
                onClick={() => {
                  onRate(n);
                  toast({ title: `Rated ${s.name} ${n}★`, body: `${a.name} appreciates the feedback.`, agent: a.id });
                }}
                role="radio"
                aria-checked={myRating === n}
                aria-label={`${n} stars`}
                className="p-0.5"
              >
                <Star className={cx("size-4 transition-colors", lit ? "fill-current text-agent" : "text-ink-faint")} />
              </motion.button>
            );
          })}
          <span className="ml-1.5 font-mono text-xs text-ink-muted">{myRating ? `you: ${myRating}` : s.rating}</span>
        </div>
        <div className="flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              navigator.clipboard?.writeText(s.content).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            aria-label="Copy"
            className="grid size-9 place-items-center rounded-pill border border-line-strong text-ink-muted transition-colors hover:border-agent hover:text-ink"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={String(copied)}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={spring.bouncy}
              >
                {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onDeploy}
            className="flex h-9 items-center gap-1.5 rounded-pill bg-agent px-3.5 text-sm font-semibold text-ink-inverse"
          >
            <Rocket className="size-4" /> Deploy
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
}

function DeployPicker({ skill, onDone }: { skill: Skill; onDone: () => void }) {
  const { deploySkill, loadout, toast, squad } = useSquad();
  const sorted = [...agents].sort(
    (x, y) => Number(y.id === skill.author) - Number(x.id === skill.author) || Number(squad.includes(y.id)) - Number(squad.includes(x.id)),
  );
  return (
    <div className="p-6 pt-4 md:p-8">
      <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">Deploy {skill.type.toLowerCase()}</p>
      <h3 className="mt-1 font-display text-2xl font-bold text-ink">{skill.name}</h3>
      <p className="mt-1 text-ink-muted">Pick which Aigent should equip it. They&apos;ll join your squad if they aren&apos;t already.</p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {sorted.map((a) => {
          const has = loadout[a.id]?.includes(skill.id);
          return (
            <li key={a.id} data-agent={a.id}>
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                disabled={has}
                onClick={() => {
                  deploySkill(skill.id, a.id);
                  toast({ title: `${skill.name} → ${a.name}`, body: "Skill equipped and ready.", agent: a.id });
                  onDone();
                }}
                className="flex w-full items-center gap-3 rounded-md border border-line p-3 text-left transition-colors hover:border-agent disabled:opacity-50"
              >
                <AgentAvatar id={a.id} sigil={a.sigil} size="sm" />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">{a.name}</span>
                  <span className="block text-xs text-ink-faint">
                    {a.id === skill.author ? "Author · best fit" : squad.includes(a.id) ? "In your squad" : a.title}
                  </span>
                </span>
                {has ? <Check className="size-4 text-success" /> : <Rocket className="size-4 text-agent" />}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

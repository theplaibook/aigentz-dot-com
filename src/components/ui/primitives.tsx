"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { useRef } from "react";
import type { AgentId, AgentStatus } from "@/lib/data/agents";
import { reveal, spring } from "@/lib/tokens";

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
export { cx };

/* ---------- Button ---------- */
type BtnProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost" | "outline" | "agent";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
};

const btnBase =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-40";
const btnVariant = {
  primary: "bg-accent text-ink-inverse hover:bg-accent-strong shadow-glow",
  agent: "bg-agent text-ink-inverse shadow-agent",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-3",
  outline: "border border-line-strong text-ink hover:border-accent hover:text-accent",
};
const btnSize = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  children,
  ...rest
}: BtnProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), spring.soft);
  const y = useSpring(useMotionValue(0), spring.soft);

  return (
    <motion.button
      ref={ref}
      style={magnetic ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className={cx(btnBase, btnVariant[variant], btnSize[size], className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/* ---------- Anchor styled as button ---------- */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof btnVariant;
  size?: keyof typeof btnSize;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={spring.snappy}
      className={cx(btnBase, btnVariant[variant], btnSize[size], className)}
    >
      {children}
    </motion.a>
  );
}

/* ---------- Chip (filter pill with shared layout highlight) ---------- */
export function Chip({
  active,
  onClick,
  children,
  layoutId,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  layoutId: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "relative shrink-0 rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200",
        active ? "text-ink-inverse" : "text-ink-muted hover:text-ink",
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={spring.snappy}
          className="absolute inset-0 rounded-pill bg-accent"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

/* ---------- Agent avatar ---------- */
export function AgentAvatar({
  id,
  sigil,
  size = "md",
  spin = false,
}: {
  id: AgentId;
  sigil: string;
  size?: "sm" | "md" | "lg" | "xl";
  spin?: boolean;
}) {
  const dims = {
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-16 text-lg",
    xl: "size-24 text-2xl",
  }[size];
  return (
    <span data-agent={id} className={cx("relative grid shrink-0 place-items-center", dims)}>
      <span
        className={cx(
          "agent-ring absolute inset-0 rounded-pill opacity-80",
          spin && "animate-spin-slow",
        )}
      />
      <span className="absolute inset-0.5 rounded-pill bg-surface" />
      <span className="agent-wash absolute inset-0.5 rounded-pill" />
      <span className="relative font-display font-bold tracking-tight text-agent">{sigil}</span>
    </span>
  );
}

/* ---------- Status dot ---------- */
export function StatusDot({ status }: { status: AgentStatus }) {
  const color = {
    online: "bg-success",
    busy: "bg-warning",
    deploying: "bg-accent-3",
  }[status];
  return (
    <span className="relative inline-flex size-2">
      <span className={cx("absolute inset-0 rounded-pill animate-pulse-ring", color)} />
      <span className={cx("relative size-2 rounded-pill", color)} />
    </span>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      {...reveal}
      className={cx("max-w-3xl", align === "center" && "mx-auto text-center")}
    >
      <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="size-1.5 rounded-pill bg-accent" />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink">
        {title}
      </h2>
      {body && <p className="mt-5 text-lg text-pretty text-ink-muted">{body}</p>}
    </motion.div>
  );
}

/* ---------- Count formatter ---------- */
export function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

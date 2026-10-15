/**
 * Motion tokens for JS-driven animation (Motion / canvas).
 * Mirrors the CSS motion tokens in globals.css so CSS and JS feel identical.
 */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const dur = {
  fast: 0.15,
  base: 0.28,
  slow: 0.6,
};

export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 32 } as const,
  soft: { type: "spring", stiffness: 180, damping: 24 } as const,
  bouncy: { type: "spring", stiffness: 500, damping: 18 } as const,
};

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: dur.slow, ease: ease.out },
};

/** Read a CSS custom property at runtime (for canvas, which can't use classes). */
export function cssVar(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

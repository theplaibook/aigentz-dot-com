"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSquad } from "@/components/providers/squad-provider";
import { cx } from "@/components/ui/primitives";
import { spring } from "@/lib/tokens";

const links = [
  { href: "/#roster", label: "Roster" },
  { href: "/#how", label: "How it works" },
  { href: "/town-square", label: "Town Square" },
  { href: "/skillz", label: "Skillz" },
  { href: "/#plaibook", label: "Plaibook" },
  { href: "/#hire", label: "Pricing" },
];

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="theaigentz home">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-sm bg-accent font-display text-lg font-black text-ink-inverse">
        <motion.span
          className="block"
          whileHover={{ rotate: -12, scale: 1.15 }}
          transition={spring.bouncy}
        >
          Z
        </motion.span>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        the<span className="text-accent">aigentz</span>
      </span>
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const { squad } = useSquad();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={spring.soft}
        className="fixed inset-x-0 top-0 z-nav"
      >
        <div
          className={cx(
            "transition-all duration-300 ease-out",
            scrolled ? "glass border-b border-line" : "border-b border-transparent",
          )}
        >
          <nav className="shell flex h-nav items-center justify-between gap-4">
            <Logo />
            <ul
              className="hidden items-center gap-1 lg:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {links.map((l) => (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    onMouseEnter={() => setHovered(l.href)}
                    className="relative z-10 block px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                  {hovered === l.href && (
                    <motion.span
                      layoutId="nav-hover"
                      transition={spring.snappy}
                      className="absolute inset-0 rounded-pill bg-surface-3"
                    />
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <Link
                href="/#hire"
                className="relative hidden h-10 items-center gap-2 rounded-pill border border-line-strong px-4 text-sm font-semibold text-ink transition-colors hover:border-accent sm:inline-flex"
              >
                <Users className="size-4" />
                Squad
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={squad.length}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={spring.bouncy}
                    className="grid min-w-5 place-items-center rounded-pill bg-accent px-1.5 font-mono text-xs text-ink-inverse"
                  >
                    {squad.length}
                  </motion.span>
                </AnimatePresence>
              </Link>
              <Link
                href="/#hire"
                className="hidden h-10 items-center rounded-pill bg-accent px-5 text-sm font-semibold text-ink-inverse shadow-glow transition-transform hover:-translate-y-0.5 md:inline-flex"
              >
                Hire an Aigent
              </Link>
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid size-11 place-items-center rounded-pill border border-line-strong text-ink lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-overlay lg:hidden">
            <motion.button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-scrim backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={spring.soft}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.5 }}
              onDragEnd={(_, i) => (i.offset.x > 90 || i.velocity.x > 500) && setOpen(false)}
              className="absolute inset-y-0 right-0 flex w-(--drawer-w) flex-col border-l border-line-strong bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-pill bg-surface-3 text-ink"
                >
                  <X className="size-5" />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring.soft, delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-md px-3 py-4 font-display text-2xl font-semibold text-ink active:bg-surface-3"
                    >
                      {l.label}
                      <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3">
                <p className="text-center font-mono text-xs text-ink-faint">← swipe to close</p>
                <Link
                  href="/#hire"
                  onClick={() => setOpen(false)}
                  className="flex h-14 items-center justify-center rounded-pill bg-accent font-semibold text-ink-inverse"
                >
                  Hire an Aigent · {squad.length} in squad
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

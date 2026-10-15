"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { Plug, Rocket, Search, Users } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/primitives";
import { ease, spring } from "@/lib/tokens";

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "Browse the roster, scroll the Town Square, and see each Aigent's real work and personality.",
    tag: "~30 sec",
  },
  {
    icon: Users,
    title: "Select your squad",
    body: "Pick one specialist or a whole squad. Bundles get cheaper as your squad grows.",
    tag: "~45 sec",
  },
  {
    icon: Plug,
    title: "Load skillz & connect",
    body: "Equip Skillz from the library and plug into Slack, GitHub, Notion or Sheets.",
    tag: "~60 sec",
  },
  {
    icon: Rocket,
    title: "Deploy",
    body: "Your Aigentz start shipping immediately — and report back in the Town Square.",
    tag: "instant",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, spring.soft);

  return (
    <section id="how" className="relative py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="How it works"
          align="center"
          title="From browsing to deployed in under 3 minutes."
          body="No prompt engineering degree required. Aigentz come pre-trained, pre-opinionated and ready to work."
        />

        <ol ref={ref} className="relative mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-4 md:gap-4">
          {/* progress rail */}
          <div aria-hidden className="absolute top-7 inset-x-(--rail-inset) hidden h-0.5 bg-line md:block">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-accent shadow-glow" />
          </div>
          <div aria-hidden className="absolute top-0 bottom-0 left-7 w-0.5 bg-line md:hidden">
            <motion.div style={{ scaleY: progress }} className="h-full origin-top bg-accent shadow-glow" />
          </div>

          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: ease.out, delay: i * 0.12 }}
              className="relative flex gap-5 md:flex-col md:items-center md:text-center"
            >
              <motion.span
                whileHover={{ scale: 1.1, rotate: -6 }}
                transition={spring.bouncy}
                className="relative z-10 grid size-14 shrink-0 place-items-center rounded-md border border-line-strong bg-surface-2 text-accent shadow-md"
              >
                <s.icon className="size-6" />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-pill bg-accent font-mono text-xs font-bold text-ink-inverse">
                  {i + 1}
                </span>
              </motion.span>
              <div className="pb-4 md:pb-0">
                <h3 className="font-display text-xl font-bold text-ink md:mt-5">{s.title}</h3>
                <p className="mt-2 text-sm text-pretty text-ink-muted">{s.body}</p>
                <span className="mt-3 inline-block rounded-pill border border-line px-2.5 py-0.5 font-mono text-xs text-ink-faint">
                  {s.tag}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

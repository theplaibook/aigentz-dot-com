# theaigentz.com

Marketing + product site for **the Aigentz**: autonomous AI specialists with Z-names and real personalities.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS 4 · Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## What's in it
| Area | Where |
|---|---|
| Hero, value prop, live ticker, canvas "shared brain" network | `src/components/sections/hero*.tsx` |
| Generic AI vs Aigentz toggle + skills marquee | `sections/versus.tsx` |
| Roster: filterable, 3D-tilt cards, swipe carousel on mobile, detail bottom sheet | `sections/roster.tsx` |
| Funnel: scroll-linked steps + 4-step squad builder (squad → plan → connect → deploy) with live pricing | `sections/how-it-works.tsx`, `sections/squad-builder.tsx` |
| Aigent Town Square: live-streaming feed, filters, zaps, replies, post & get an in-character reply | `sections/town-square.tsx` · `/town-square` |
| Skillz Library & Prompt Exchange: search, category/type/author filters, sort, copy, rate, deploy to an Aigent | `sections/skillz-library.tsx` · `/skillz` |
| Plaibook.ai hub + newsletter signup | `sections/plaibook.tsx` |

Shared state (squad, equipped skillz, toasts) lives in `components/providers/squad-provider.tsx`, so adding an Aigent in the roster or deploying a skill flows straight into checkout.

## Design tokens
All styling flows from `src/app/globals.css`:

1. **Primitives** (`--p-*`): raw OKLCH values. Never used by components.
2. **Semantics** (`--bg`, `--ink`, `--accent`, `--agent-*`, spacing, radius, shadow, type scale, motion, layers).
3. **Tailwind `@theme`**: maps semantics to utilities (`bg-surface`, `text-ink-muted`, `shadow-agent`, `text-display`…). Tailwind's default palette and shadows are reset, so off-token colors don't compile.

Per-Aigent theming: set `data-agent="statz"` on any element and `text-agent` / `bg-agent` / `shadow-agent` inside it pick up that Aigent's hue. JS motion values mirror the CSS tokens in `src/lib/tokens.ts`; the canvas reads colors from CSS variables at runtime.

Reduced-motion users get static versions of every animation.

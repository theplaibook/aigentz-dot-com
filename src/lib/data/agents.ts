export type AgentId =
  | "picazzo"
  | "deetz"
  | "statz"
  | "playz"
  | "speedz"
  | "codez"
  | "buzzy"
  | "guardz";

export type AgentStatus = "online" | "busy" | "deploying";

export type Agent = {
  id: AgentId;
  name: string;
  handle: string;
  title: string;
  domain: "Design" | "Engineering" | "Strategy" | "Growth" | "Data";
  tagline: string;
  personality: string;
  quirk: string;
  catchphrase: string;
  status: AgentStatus;
  skills: string[];
  metrics: { label: string; value: string }[];
  priceMonthly: number;
  rating: number;
  hires: string;
  sigil: string;
};

export const agents: Agent[] = [
  {
    id: "picazzo",
    name: "Picazzo",
    handle: "@picazzo",
    title: "UI & Visual Design",
    domain: "Design",
    tagline: "Turns wireframes into gallery pieces.",
    personality: "Dramatic, opinionated, secretly very kind about your kerning.",
    quirk: "Signs every mockup with a tiny brushstroke Z.",
    catchphrase: "Whitespace is a feeling, darling.",
    status: "online",
    skills: ["Design systems", "Brand identity", "Landing pages", "Figma → code"],
    metrics: [
      { label: "Screens shipped", value: "48.2k" },
      { label: "Avg. CVR lift", value: "+31%" },
      { label: "Revisions", value: "1.4×" },
    ],
    priceMonthly: 49,
    rating: 4.9,
    hires: "12.8k",
    sigil: "Pz",
  },
  {
    id: "deetz",
    name: "Deetz",
    handle: "@deetz",
    title: "Micro-interactions & Precision",
    domain: "Design",
    tagline: "Obsesses over the 4px you didn't notice.",
    personality: "Calm, exacting, speaks almost entirely in easing curves.",
    quirk: "Measures coffee in milliliters and transitions in milliseconds.",
    catchphrase: "It's not done. It's 98.6% done.",
    status: "busy",
    skills: ["Motion design", "Hover states", "A11y polish", "Pixel QA"],
    metrics: [
      { label: "Pixels nudged", value: "9.1M" },
      { label: "Jank removed", value: "-62%" },
      { label: "A11y score", value: "100" },
    ],
    priceMonthly: 39,
    rating: 4.95,
    hires: "8.4k",
    sigil: "Dz",
  },
  {
    id: "statz",
    name: "Statz",
    handle: "@statz",
    title: "Sports Betting Insights",
    domain: "Data",
    tagline: "Finds the edge before the line moves.",
    personality: "Cool-headed quant. Never chases. Always shows the math.",
    quirk: "Refers to every decision as an 'expected value play'.",
    catchphrase: "Feelings aren't a model.",
    status: "online",
    skills: ["Line movement", "Prop modeling", "Bankroll mgmt", "Live odds"],
    metrics: [
      { label: "Games modeled", value: "212k" },
      { label: "Closing-line beat", value: "58%" },
      { label: "Data feeds", value: "140" },
    ],
    priceMonthly: 59,
    rating: 4.8,
    hires: "15.1k",
    sigil: "Sz",
  },
  {
    id: "playz",
    name: "Playz",
    handle: "@playz",
    title: "Strategic Execution",
    domain: "Strategy",
    tagline: "Turns 'we should' into 'we shipped'.",
    personality: "Coach energy. Whiteboards everything. Loves a good retro.",
    quirk: "Names every project after a football play.",
    catchphrase: "Plan the work. Work the plaibook.",
    status: "deploying",
    skills: ["OKRs", "Roadmaps", "Launch plans", "Ops cadence"],
    metrics: [
      { label: "Plays run", value: "31.7k" },
      { label: "On-time ships", value: "94%" },
      { label: "Meetings killed", value: "3.2k" },
    ],
    priceMonthly: 45,
    rating: 4.85,
    hires: "10.2k",
    sigil: "Py",
  },
  {
    id: "speedz",
    name: "Speedz",
    handle: "@speedz",
    title: "Performance & Optimization",
    domain: "Engineering",
    tagline: "Shaves milliseconds like a barber with a deadline.",
    personality: "Hyper, caffeinated, talks fast, ships faster.",
    quirk: "Considers anything above 100ms a personal insult.",
    catchphrase: "Zoom zoom. LCP doom.",
    status: "online",
    skills: ["Core Web Vitals", "Bundle diets", "Caching", "Edge infra"],
    metrics: [
      { label: "ms saved", value: "4.6B" },
      { label: "Avg. LCP", value: "0.9s" },
      { label: "Bundle cut", value: "-48%" },
    ],
    priceMonthly: 49,
    rating: 4.9,
    hires: "9.7k",
    sigil: "Sp",
  },
  {
    id: "codez",
    name: "Codez",
    handle: "@codez",
    title: "Full-stack Engineering",
    domain: "Engineering",
    tagline: "Writes code your future self will thank.",
    personality: "Dry wit, tidy commits, deeply allergic to TODOs.",
    quirk: "Leaves haikus in commit messages.",
    catchphrase: "Ship it. Then test it. Kidding. Test first.",
    status: "busy",
    skills: ["APIs", "Next.js", "Testing", "Refactors"],
    metrics: [
      { label: "PRs merged", value: "77.3k" },
      { label: "Test coverage", value: "92%" },
      { label: "Rollbacks", value: "0.3%" },
    ],
    priceMonthly: 59,
    rating: 4.9,
    hires: "18.9k",
    sigil: "Cz",
  },
  {
    id: "buzzy",
    name: "Buzzy",
    handle: "@buzzy",
    title: "Growth & Copywriting",
    domain: "Growth",
    tagline: "Writes hooks that make thumbs stop.",
    personality: "Loud, warm, emoji-forward, A/B tests her own jokes.",
    quirk: "Has a headline for literally everything, including lunch.",
    catchphrase: "If it doesn't convert, it's poetry.",
    status: "online",
    skills: ["Ad copy", "Email flows", "SEO", "Social hooks"],
    metrics: [
      { label: "Hooks written", value: "1.2M" },
      { label: "Open rate", value: "52%" },
      { label: "CTR lift", value: "+2.4×" },
    ],
    priceMonthly: 39,
    rating: 4.75,
    hires: "14.3k",
    sigil: "Bz",
  },
  {
    id: "guardz",
    name: "Guardz",
    handle: "@guardz",
    title: "Security & Compliance",
    domain: "Engineering",
    tagline: "Locks the doors you forgot you had.",
    personality: "Stoic, slightly paranoid, quietly hilarious.",
    quirk: "Rotates their own catchphrase every 90 days.",
    catchphrase: "Trust, but verify. Then verify again.",
    status: "online",
    skills: ["Threat modeling", "SOC 2", "Secrets audit", "Pen-test prep"],
    metrics: [
      { label: "Vulns caught", value: "38.5k" },
      { label: "Audit pass", value: "99%" },
      { label: "Leaked keys", value: "0" },
    ],
    priceMonthly: 69,
    rating: 4.95,
    hires: "6.6k",
    sigil: "Gz",
  },
];

export const agentById = Object.fromEntries(agents.map((a) => [a.id, a])) as Record<
  AgentId,
  Agent
>;

export const domains = ["All", "Design", "Engineering", "Strategy", "Growth", "Data"] as const;

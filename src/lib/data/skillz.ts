import type { AgentId } from "./agents";

export type SkillType = "Skill" | "Prompt";

export type Skill = {
  id: string;
  type: SkillType;
  name: string;
  summary: string;
  category: "Design" | "Engineering" | "Growth" | "Strategy" | "Data" | "Security";
  author: AgentId;
  rating: number;
  ratings: number;
  deploys: number;
  tags: string[];
  content: string;
};

export const skillz: Skill[] = [
  {
    id: "s1",
    type: "Skill",
    name: "Token Forge",
    summary: "Generates a 3-tier design token system from a single brand color.",
    category: "Design",
    author: "picazzo",
    rating: 4.9,
    ratings: 1840,
    deploys: 22400,
    tags: ["tokens", "tailwind", "brand"],
    content: "skill: token-forge\ninput: brand_hex\noutput: primitives, semantics, tailwind theme",
  },
  {
    id: "s2",
    type: "Prompt",
    name: "Hero Hook Generator",
    summary: "10 above-the-fold headlines ranked by clarity, curiosity and specificity.",
    category: "Growth",
    author: "buzzy",
    rating: 4.8,
    ratings: 3210,
    deploys: 51000,
    tags: ["copy", "landing", "a/b"],
    content:
      "You are Buzzy. Write 10 hero headlines for {{product}} aimed at {{audience}}. Score each 1–10 on clarity, curiosity, specificity. Return a ranked table.",
  },
  {
    id: "s3",
    type: "Skill",
    name: "Line Watcher",
    summary: "Alerts you when a betting line moves more than your threshold in N minutes.",
    category: "Data",
    author: "statz",
    rating: 4.7,
    ratings: 990,
    deploys: 13800,
    tags: ["odds", "alerts", "live"],
    content: "skill: line-watcher\nthreshold: 1.5\nwindow_min: 30\nnotify: push",
  },
  {
    id: "s4",
    type: "Prompt",
    name: "Easing Doctor",
    summary: "Diagnoses janky animations and prescribes durations + curves.",
    category: "Design",
    author: "deetz",
    rating: 4.95,
    ratings: 760,
    deploys: 9100,
    tags: ["motion", "ux", "polish"],
    content:
      "You are Deetz. Review these animations: {{list}}. For each, give duration (ms), easing (cubic-bezier), and why. Flag anything over 400ms.",
  },
  {
    id: "s5",
    type: "Skill",
    name: "Bundle Diet",
    summary: "Finds the heaviest imports in your build and proposes lazy-load splits.",
    category: "Engineering",
    author: "speedz",
    rating: 4.85,
    ratings: 1420,
    deploys: 18700,
    tags: ["perf", "webpack", "vitals"],
    content: "skill: bundle-diet\nanalyze: .next/analyze\ntarget_kb: 170\nsuggest: dynamic_import",
  },
  {
    id: "s6",
    type: "Prompt",
    name: "Two-Minute Drill",
    summary: "A 5-step launch plan for shipping a page in one afternoon.",
    category: "Strategy",
    author: "playz",
    rating: 4.9,
    ratings: 2050,
    deploys: 27600,
    tags: ["launch", "plaibook", "ops"],
    content:
      "You are Playz. Build a 5-step launch plan for {{project}} that ships today. For each step: owner Aigent, time box, done-definition.",
  },
  {
    id: "s7",
    type: "Skill",
    name: "Secret Sweeper",
    summary: "Scans repos and env files for leaked keys, then rotates them.",
    category: "Security",
    author: "guardz",
    rating: 4.95,
    ratings: 1130,
    deploys: 16200,
    tags: ["secrets", "audit", "ci"],
    content: "skill: secret-sweeper\nscan: git_history\nrotate: true\nreport: slack",
  },
  {
    id: "s8",
    type: "Prompt",
    name: "Haiku Commit",
    summary: "Turns your diff into a commit message. Optional haiku mode.",
    category: "Engineering",
    author: "codez",
    rating: 4.6,
    ratings: 4400,
    deploys: 64000,
    tags: ["git", "fun", "dx"],
    content:
      "You are Codez. Summarize this diff as a conventional commit. If haiku=true, add a 5-7-5 haiku body.\n{{diff}}",
  },
  {
    id: "s9",
    type: "Prompt",
    name: "Prop Bet Breakdown",
    summary: "Explains a player prop with base rates, matchup, and fair odds.",
    category: "Data",
    author: "statz",
    rating: 4.75,
    ratings: 1670,
    deploys: 21300,
    tags: ["props", "modeling"],
    content:
      "You are Statz. For {{player}} {{prop}}: give last-20 base rate, matchup adjustment, fair odds, and edge vs {{book_odds}}. No hype.",
  },
  {
    id: "s10",
    type: "Skill",
    name: "Hover Kit",
    summary: "Drop-in micro-interaction presets: magnetic, tilt, glow, ripple.",
    category: "Design",
    author: "deetz",
    rating: 4.9,
    ratings: 880,
    deploys: 11900,
    tags: ["motion", "react", "components"],
    content: "skill: hover-kit\npresets: [magnetic, tilt, glow, ripple]\nframework: react",
  },
  {
    id: "s11",
    type: "Prompt",
    name: "Email Flow Architect",
    summary: "A 5-email onboarding sequence with subject lines and send timing.",
    category: "Growth",
    author: "buzzy",
    rating: 4.7,
    ratings: 1290,
    deploys: 15500,
    tags: ["email", "lifecycle"],
    content:
      "You are Buzzy. Design a 5-email onboarding flow for {{product}}. Include subject, preview text, CTA, and day offset.",
  },
  {
    id: "s12",
    type: "Skill",
    name: "OKR Compiler",
    summary: "Converts messy goals into measurable OKRs with owners.",
    category: "Strategy",
    author: "playz",
    rating: 4.65,
    ratings: 720,
    deploys: 8800,
    tags: ["okrs", "planning"],
    content: "skill: okr-compiler\ninput: goals.md\noutput: objectives, key_results, owners",
  },
];

export const skillCategories = [
  "All",
  "Design",
  "Engineering",
  "Growth",
  "Strategy",
  "Data",
  "Security",
] as const;

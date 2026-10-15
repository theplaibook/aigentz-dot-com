import type { Metadata } from "next";
import { SkillzLibrary } from "@/components/sections/skillz-library";

export const metadata: Metadata = {
  title: "Skillz Library & Prompt Exchange",
  description: "Search, rate, copy and deploy reusable Skillz and Prompts to your Aigentz.",
};

export default function SkillzPage() {
  return <SkillzLibrary full />;
}

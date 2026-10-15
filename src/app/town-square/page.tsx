import type { Metadata } from "next";
import { TownSquare } from "@/components/sections/town-square";

export const metadata: Metadata = {
  title: "Aigent Town Square",
  description: "A live feed of insights, wins and banter from the Aigentz.",
};

export default function TownSquarePage() {
  return <TownSquare full />;
}

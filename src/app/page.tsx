import { FinalCta } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Plaibook } from "@/components/sections/plaibook";
import { Roster } from "@/components/sections/roster";
import { SkillzLibrary } from "@/components/sections/skillz-library";
import { SquadBuilder } from "@/components/sections/squad-builder";
import { TownSquare } from "@/components/sections/town-square";
import { Versus } from "@/components/sections/versus";

export default function Home() {
  return (
    <>
      <Hero />
      <Versus />
      <Roster />
      <HowItWorks />
      <TownSquare />
      <SkillzLibrary />
      <SquadBuilder />
      <Plaibook />
      <FinalCta />
    </>
  );
}

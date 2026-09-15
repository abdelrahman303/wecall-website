import { Difference } from "../components/Difference";
import { Strategies } from "../components/Strategies";
import { StrategiesHero } from "../components/StrategiesHero";

export function StrategiesPage() {
  return (
    <main>
      <StrategiesHero />
      <Strategies />
      <Difference />
    </main>
  );
}

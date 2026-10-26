import { Hero } from "@/components/Hero";
import { Hint } from "@/components/Hint";
import { Services } from "@/components/Services";
import { Waitlist } from "@/components/Waitlist";

export default function Home() {
  return (
    <main>
      <Hero />
      <Hint />
      <Services />
      <Waitlist />
    </main>
  );
}

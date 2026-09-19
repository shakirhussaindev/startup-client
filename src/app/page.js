import HeroBanner from "@/components/home/HeroBanner";
import StartupStats from "@/components/home/StartupStats";
import WhyJoinSection from "@/components/home/WhyJoinSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroBanner />
      <WhyJoinSection/>
      <StartupStats/>
    </main>
  );
}

import FeaturedOpportunities from "@/components/home/FeaturedOpportunities";
import FeaturedStartups from "@/components/home/FeaturedStartups";
import HeroBanner from "@/components/home/HeroBanner";
import StartupStats from "@/components/home/StartupStats";
import WhyJoinSection from "@/components/home/WhyJoinSection";

export const metadata = {
  title: "StartupForge | Where Ideas Meet Great Teams",
  description:
    "Connect with startup founders, discover opportunities, and find skilled collaborators to build the next great venture with StartupForge.",
  keywords: [
    "StartupForge",
    "startup founders",
    "startup collaborators",
    "startup opportunities",
    "co-founder platform",
    "startup team building",
    "startup networking",
  ],
  openGraph: {
    title: "StartupForge | Where Ideas Meet Great Teams",
    description:
      "Connect with founders, discover startup opportunities, and find skilled collaborators to build great teams.",
    url: "https://startup-client-eta.vercel.app/",
    siteName: "StartupForge",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroBanner />
      <FeaturedStartups />
      <FeaturedOpportunities/>
      <WhyJoinSection />
      <StartupStats />
    </main>
  );
}


import OpportunitiesExplorer from "@/components/opportunities/OpportunitiesExplorer";
import { getOpportunities } from "@/lib/api/opportunities";

export const metadata = {
  title: "Explore Opportunities - StartupForge",
  description:
    "Find high-impact roles, founding engineers, and equity partnerships.",
};

export default async function OpportunitiesPage() {

  const opportunities = await getOpportunities()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Explore Opportunities
        </h1>
        <p className="max-w-xl text-sm text-default-500">
          Discover high-impact roles, founding engineering positions, and equity
          partnerships across vetted early-stage ventures.
        </p>
      </div>

      <OpportunitiesExplorer initialOpportunities={opportunities} />
    </div>
  );
}

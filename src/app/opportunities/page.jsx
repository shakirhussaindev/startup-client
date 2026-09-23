import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { getOpportunities } from "@/lib/api/opportunities";



export default async function OpportunitiesPage() {

  const opportunities = await getOpportunities()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Explore Opportunities 
        </h1>
        <p className="text-sm text-default-500 max-w-xl">
          Discover high-impact roles, founding engineering positions, and equity
          partnerships across verified early-stage ventures.
        </p>
      </div>

      {/* Responsive Opportunity Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp._id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}

// app/opportunities/page.jsx
import OpportunitiesExplorer from "@/components/opportunities/OpportunitiesExplorer";
import { getOpportunities } from "@/lib/api/opportunities";

export const metadata = {
  title: "Explore Opportunities - StartupForge",
  description:
    "Find high-impact roles, founding engineers, and equity partnerships.",
};

export default async function OpportunitiesPage({ searchParams }) {
  const filterQuery = await searchParams;


  const querySearch = new URLSearchParams(filterQuery);
  const queryString = querySearch.toString();

 
  const {opportunities, total} = await getOpportunities(queryString)

  return (
    <div className="mx-auto max-w-10/12 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Explore Opportunities
        </h1>
        <p className="max-w-xl text-sm text-default-500">
          Discover high-impact roles, founding engineering positions, and equity
          partnerships across vetted early-stage ventures.
        </p>
      </div>

      <OpportunitiesExplorer
        filterQuery={filterQuery}
        initialOpportunities={opportunities }
        total={total}
      />
    </div>
  );
}

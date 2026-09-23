// app/dashboard/founder/my-opportunities/page.jsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { getStartupOpportunities } from "@/lib/api/opportunities";
import OpportunitiesTable from "@/components/dashboard/founder/OpportunitiesTable";
import { getLoggedInFounderStartup } from "@/lib/api/startup";

export const metadata = {
  title: "Manage Opportunities - StartupForge",
};

export default async function MyOpportunitiesPage() {
  const startup = await getLoggedInFounderStartup()
  const opportunities = await getStartupOpportunities(startup._id) || []


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Opportunities
          </h1>
          <p className="mt-1 text-sm text-default-500">
            View, edit, or manage candidate applications for your startup
            listings.
          </p>
        </div>

        {/* FIX: Wrap Button inside Link instead of as={Link} */}
        <Link href="/dashboard/founder/my-opportunities/new">
          <Button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-semibold text-white shadow-md shadow-orange-500/20 hover:scale-[1.02] transition-transform"
          >
            <Plus size={16} />
            <span>Add Opportunity</span>
          </Button>
        </Link>
      </div>

      {/* Render Table */}
      <OpportunitiesTable initialOpportunities={opportunities} />
    </div>
  );
}

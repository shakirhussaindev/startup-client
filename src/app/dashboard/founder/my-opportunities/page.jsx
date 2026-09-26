// // app/dashboard/founder/my-opportunities/page.jsx
// import Link from "next/link";
// import { Plus } from "lucide-react";
// import { Button } from "@heroui/react";
// import { getStartupOpportunities } from "@/lib/api/opportunities";
// import OpportunitiesTable from "@/components/dashboard/founder/OpportunitiesTable";
// import { getLoggedInFounderStartup } from "@/lib/api/startup";

// export const metadata = {
//   title: "Manage Opportunities - StartupForge",
// };

// export default async function MyOpportunitiesPage() {
//   const startup = await getLoggedInFounderStartup()
//   const opportunities = await getStartupOpportunities(startup._id) || []

// console.log("startup opportunity length", opportunities.length)
//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
//             My Opportunities
//           </h1>
//           <p className="mt-1 text-sm text-default-500">
//             View, edit, or manage candidate applications for your startup
//             listings.
//           </p>
//         </div>

//         {/* FIX: Wrap Button inside Link instead of as={Link} */}
//         <Link href="/dashboard/founder/my-opportunities/new">
//           <Button
//             type="button"
//             className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-semibold text-white shadow-md shadow-orange-500/20 hover:scale-[1.02] transition-transform"
//           >
//             <Plus size={16} />
//             <span>Add Opportunity</span>
//           </Button>
//         </Link>
//       </div>

//       {/* Render Table */}
//       <OpportunitiesTable initialOpportunities={opportunities} />
//     </div>
//   );
// }












// app/dashboard/founder/my-opportunities/page.jsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Plus,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Lock,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@heroui/react";
import { getStartupOpportunities } from "@/lib/api/opportunities";
import { getLoggedInFounderStartup } from "@/lib/api/startup";
import { getUserSession } from "@/lib/core/session";
import { getPlanById } from "@/lib/api/plans";
import OpportunitiesTable from "@/components/dashboard/founder/OpportunitiesTable";

export const metadata = {
  title: "Manage Opportunities - StartupForge",
};

export default async function MyOpportunitiesPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login?redirect=/dashboard/founder/my-opportunities");
  }

  const startup = await getLoggedInFounderStartup();

  // If founder hasn't registered a startup yet
  if (!startup) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/60 p-12 text-center shadow-sm backdrop-blur-xl dark:border-default-100/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
          <Briefcase size={28} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-foreground">
          Register Your Startup First
        </h2>
        <p className="mt-1 max-w-sm text-xs text-default-500">
          You need an active venture profile before publishing opportunities and recruiting co-founders.
        </p>
        <Link href="/dashboard/founder/my-startup" className="mt-5">
          <Button className="rounded-xl bg-orange-500 font-semibold text-white shadow-md shadow-orange-500/20">
            Create Startup Profile
          </Button>
        </Link>
      </div>
    );
  }

  // 1. Fetch Plan Details
  let plan = null;
  if (user.plan) {
    plan = await getPlanById(user.plan);
  }
  if (!plan) {
    plan = { planId: "free", name: "Free", maxOpportunityPostPerMonth: 3 };
  }

  // 2. Fetch Opportunities
  const opportunities = (await getStartupOpportunities(startup._id)) || [];

  // 3. Compute Quota Analytics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyPostsCount = opportunities.filter((opp) => {
    if (!opp.createdAt) return false;
    return new Date(opp.createdAt) >= startOfMonth;
  }).length;

  const maxLimit = plan.maxOpportunityPostPerMonth ?? 3;
  const isQuotaReached = monthlyPostsCount >= maxLimit;
  const remainingQuota = Math.max(0, maxLimit - monthlyPostsCount);
  const activeOpportunities = opportunities.filter((opp) => opp.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Opportunities
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400 capitalize">
              {plan.name} Tier
            </span>
          </div>
          <p className="mt-1 text-xs text-default-500 sm:text-sm">
            Manage your open positions, track applicants, and monitor monthly posting allowances.
          </p>
        </div>

        {/* Dynamic Action Button: Links to /new if quota left, or /plans if limit reached */}
        {isQuotaReached ? (
          <Link href="/plans">
            <Button
              type="button"
              className="flex h-10 items-center gap-2 rounded-xl bg-default-100 px-4 text-xs font-semibold text-foreground hover:bg-default-200 dark:bg-default-100/20"
            >
              <Lock size={14} className="text-rose-500" />
              <span>Limit Reached • Upgrade Plan</span>
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/founder/my-opportunities/new">
            <Button
              type="button"
              className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-transform hover:scale-[1.02]"
            >
              <Plus size={16} />
              <span>Add Opportunity</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Quota Exceeded Alert Banner */}
      {isQuotaReached && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>
              You have published <strong>{monthlyPostsCount} of {maxLimit}</strong> positions this month (Monthly limit reached).
            </span>
          </div>
          <Link href="/plans">
            <span className="font-bold underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-300">
              Upgrade Now
            </span>
          </Link>
        </div>
      )}

      {/* ================= ANALYTICS & QUOTA CARDS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        
        {/* Card 1: Active Listings */}
        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-5 shadow-xs backdrop-blur-xl dark:border-default-100/15">
          <div className="flex items-center justify-between text-default-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Roles</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {activeOpportunities}
          </p>
          <span className="text-[11px] text-default-400">Accepting applications</span>
        </div>

        {/* Card 2: Total Opportunities */}
        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-5 shadow-xs backdrop-blur-xl dark:border-default-100/15">
          <div className="flex items-center justify-between text-default-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Listings</span>
            <Briefcase size={16} className="text-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {opportunities.length}
          </p>
          <span className="text-[11px] text-default-400">All-time published listings</span>
        </div>

        {/* Card 3: Monthly Plan Quota Meter */}
        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-5 shadow-xs backdrop-blur-xl dark:border-default-100/15">
          <div className="flex items-center justify-between text-default-400">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Allowance</span>
            <TrendingUp size={16} className="text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {monthlyPostsCount}
            </span>
            <span className="text-xs font-semibold text-default-400">
              / {maxLimit} posts
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={isQuotaReached ? "font-bold text-rose-500" : "text-default-400"}>
              {isQuotaReached ? "0 slots left" : `${remainingQuota} slots remaining`}
            </span>
            {plan.planId !== "enterprise" && (
              <Link href="/plans" className="font-bold text-orange-500 hover:underline">
                Upgrade
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* ================= OPPORTUNITIES TABLE ================= */}
      <OpportunitiesTable initialOpportunities={opportunities} />
    </div>
  );
}
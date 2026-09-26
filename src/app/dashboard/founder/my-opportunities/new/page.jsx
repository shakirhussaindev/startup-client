// import React from 'react';
// import AddOpportunityForm from './AddOpportunityForm';
// import { getLoggedInFounderStartup } from '@/lib/api/startup';
// import { getPlanById } from '@/lib/api/plans';
// import { getUserSession } from '@/lib/core/session';

// const AddOpportunityPage = async () => {
//   const startup = await getLoggedInFounderStartup()

//   const user = await getUserSession();
//   const plan = await getPlanById(user?.plan || "")
//   return (
//     <div>
//       <AddOpportunityForm founderStartup ={startup} plan={plan}/>
//     </div>
//   );
// };

// export default AddOpportunityPage;

import { redirect } from "next/navigation";
import { getLoggedInFounderStartup } from "@/lib/api/startup";
import { getPlanById } from "@/lib/api/plans";
import { getUserSession } from "@/lib/core/session";
import { getStartupOpportunities } from "@/lib/api/opportunities";
import AddOpportunityForm from "./AddOpportunityForm";

export const metadata = {
  title: "Post New Opportunity - StartupForge",
};

export default async function AddOpportunityPage() {
  const user = await getUserSession();

  // 1. Session check
  if (!user) {
    redirect("/login?redirect=/dashboard/founder/my-opportunities/new");
  }

  // 2. Role check
  if (user.role !== "founder") {
    redirect("/dashboard");
  }

  // 3. Fetch founder's startup profile
  const startup = await getLoggedInFounderStartup();
  if (!startup) {
    redirect("/dashboard/founder/my-startup");
  }

  // 4. Resolve plan details (Fallback to Free plan)
  let plan = null;
  if (user.plan) {
    plan = await getPlanById(user.plan);
  }

  if (!plan) {
    plan = {
      planId: "free",
      name: "Free",
      maxOpportunityPostPerMonth: 3,
    };
  }

  // 5. Calculate posts published in current calendar month
  const opportunities = (await getStartupOpportunities(startup._id)) || [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyPostsCount = opportunities.filter((opp) => {
    if (!opp.createdAt) return false;
    return new Date(opp.createdAt) >= startOfMonth;
  }).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <AddOpportunityForm
        founderStartup={startup}
        plan={plan}
        monthlyPostsCount={monthlyPostsCount}
      />
    </div>
  );
}
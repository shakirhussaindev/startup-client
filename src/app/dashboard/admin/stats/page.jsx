// app/dashboard/admin/stats/page.jsx
import React from "react";
import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startup";
import { getSubscription } from "@/lib/api/subscription";
import { getUserList } from "@/lib/api/users";
import AdminStatsCharts from "@/components/dashboard/admin/AdminStatsCharts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Platform Statistics & Charts - Admin Command Center",
  description:
    "Visual analytics for revenue, user roles, startup growth, and ecosystem health.",
};

export default async function AdminStatsPage() {
  const [userData, startupData, opportunityData, subscriptionData] =
    await Promise.all([
      getUserList().catch(() => ({ users: [] })),
      getStartups().catch(() => []),
      getOpportunities().catch(() => []),
      getSubscription().catch(() => []),
    ]);

  const users = userData?.users || [];
  const startups = Array.isArray(startupData) ? startupData : [];
  const opportunities = Array.isArray(opportunityData) ? opportunityData : [];
  const subscriptions = Array.isArray(subscriptionData) ? subscriptionData : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Ecosystem Visual Analytics
        </h1>
        <p className="text-xs text-default-500 sm:text-sm">
          Interactive distribution charts, revenue trends, and user demography
          data.
        </p>
      </div>

      {/* Interactive Charts Dashboard */}
      <AdminStatsCharts
        users={users}
        startups={startups}
        opportunities={opportunities}
        subscriptions={subscriptions}
      />
    </div>
  );
}

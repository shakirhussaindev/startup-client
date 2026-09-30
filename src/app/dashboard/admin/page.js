// app/dashboard/admin/page.jsx
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startup";
import { getSubscription } from "@/lib/api/subscription";
import { getUserList } from "@/lib/api/users";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Overview - StartupForge",
  description: "High-level summary of platform users, ventures, and revenue.",
};

const PLAN_PRICES = {
  premium: 19.99,
  enterprise: 49.99,
};

export default async function AdminDashboardHomePage() {
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

  // মোট রেভিনিউ ক্যালকুলেশন
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    const plan = sub.planId?.toLowerCase();
    return sum + (PLAN_PRICES[plan] || 0);
  }, 0);

  const formattedRevenue = totalRevenue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
            <ShieldCheck size={12} />
            Command Center
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Ecosystem Overview
        </h1>
        <p className="text-xs text-default-500 sm:text-sm">
          High-level key performance metrics across StartupForge.
        </p>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 shadow-sm backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {formattedRevenue}
            </h2>
            <Link
              href="/dashboard/admin/transactions"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <span>View transactions</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Total Users
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {users.length}
            </h2>
            <Link
              href="/dashboard/admin/users"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400"
            >
              <span>Manage users</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Startups */}
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Total Startups
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {startups.length}
            </h2>
            <p className="mt-2 text-xs text-default-400">
              Registered venture profiles
            </p>
          </div>
        </div>

        {/* Total Opportunities */}
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Opportunities
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {opportunities.length}
            </h2>
            <p className="mt-2 text-xs text-default-400">
              Published collaborative roles
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-default-200/70 bg-default-100/40 p-4 text-xs dark:border-default-100/15 dark:bg-default-100/5">
        <div className="flex items-center gap-2 text-default-500">
          <TrendingUp size={14} className="text-emerald-500" />
          <span>
            Total Subscription Events:{" "}
            <strong className="text-foreground">{subscriptions.length}</strong>
          </span>
        </div>
        <Link
          href="/dashboard/admin/transactions"
          className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-orange-500 transition-colors"
        >
          <CreditCard size={13} className="text-orange-500" />
          <span>View All Invoices & Stripe Records</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

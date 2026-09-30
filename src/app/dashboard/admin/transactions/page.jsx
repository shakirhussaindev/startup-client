// app/dashboard/admin/transactions/page.jsx
import Link from "next/link";
import {
  CreditCard,
  Layers,
  Clock,
  ArrowLeft,
  DollarSign,
  Users,
} from "lucide-react";
import { getSubscription } from "@/lib/api/subscription";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Transactions & Revenue - Admin Dashboard",
  description:
    "Detailed subscription logs, Stripe sessions, and tier breakdowns.",
};

const PLAN_PRICES = {
  premium: 19.99,
  enterprise: 49.99,
};

export default async function AdminTransactionsPage() {
  const subscriptionData = await getSubscription().catch(() => []);
  const subscriptions = Array.isArray(subscriptionData) ? subscriptionData : [];

  const premiumSubs = subscriptions.filter(
    (s) => s.planId?.toLowerCase() === "premium",
  );
  const enterpriseSubs = subscriptions.filter(
    (s) => s.planId?.toLowerCase() === "enterprise",
  );

  const premiumRevenue = premiumSubs.length * PLAN_PRICES.premium;
  const enterpriseRevenue = enterpriseSubs.length * PLAN_PRICES.enterprise;
  const totalRevenue = premiumRevenue + enterpriseRevenue;

  const uniqueSubscribers = new Set(
    subscriptions.map((s) => s.email?.toLowerCase()).filter(Boolean),
  ).size;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground"
        >
          <ArrowLeft size={13} />
          <span>Back to Overview</span>
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Subscription Invoices & Transactions
        </h1>
        <p className="text-xs text-default-500 sm:text-sm">
          Detailed revenue audit and Stripe checkout sessions.
        </p>
      </div>

      {/* Revenue Tier Split Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Gross Revenue */}
        <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-6 dark:border-emerald-500/15">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Gross Revenue
          </span>
          <div className="mt-3 text-3xl font-black text-foreground">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-default-500">
            {uniqueSubscribers} unique customer accounts
          </p>
        </div>

        {/* Premium Breakdown */}
        <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-6 dark:border-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
              Premium Tier ($19.99)
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground">
            ${premiumRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-default-500">
            {premiumSubs.length} subscriptions sold
          </p>
        </div>

        {/* Enterprise Breakdown */}
        <div className="rounded-3xl border border-purple-500/25 bg-purple-500/5 p-6 dark:border-purple-500/15">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-0.5 text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
              <Layers size={11} />
              Enterprise Tier ($49.99)
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground">
            ${enterpriseRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-default-500">
            {enterpriseSubs.length} subscriptions sold
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
        <div className="border-b border-default-200/60 p-6 dark:border-default-100/15">
          <h2 className="text-base font-bold text-foreground">
            All Stripe Invoices ({subscriptions.length})
          </h2>
          <p className="text-xs text-default-500">
            Chronological records of all checkout events.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-default-200/60 bg-default-100/40 text-[11px] font-bold uppercase tracking-wider text-default-500 dark:border-default-100/15 dark:bg-default-100/5">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Customer Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Plan Tier
                </th>
                <th scope="col" className="px-6 py-4">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Stripe Session ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-200/60 dark:divide-default-100/10">
              {subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-default-500"
                  >
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                [...subscriptions].reverse().map((sub, idx) => {
                  const isEnterprise =
                    sub.planId?.toLowerCase() === "enterprise";
                  const price = isEnterprise
                    ? PLAN_PRICES.enterprise
                    : PLAN_PRICES.premium;
                  const formattedDate = sub.createdAt
                    ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <tr
                      key={sub._id || idx}
                      className="transition-colors hover:bg-default-100/30 dark:hover:bg-default-100/5"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                            isEnterprise
                              ? "border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {sub.planId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        ${price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-default-500">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-default-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-[11px] text-default-400">
                        {sub.stripeSessionId || "Manual / Free"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

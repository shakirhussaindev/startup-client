
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

import { Button } from "@heroui/react";

import { getOpportunityById } from "@/lib/api/opportunities";
import { getUserSession } from "@/lib/core/session";



export default async function OpportunityApplyPage({ params }) {
  const { id } = await params;

  // 1. Session check
  const user = await getUserSession();
  if (!user) {
    redirect(`/login?redirect=/opportunities/${id}/apply`);
  }

  // 2. Opportunity existence check
  const opportunity = await getOpportunityById(id);
  if (!opportunity) {
    notFound();
  }

  // 3. Role-based guard (Collaborator only)
  if (user.role !== "collaborator") {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-default-200/80 bg-background/90 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
            <ShieldAlert size={32} />
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Role Restricted
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Collaborator Account Required
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-default-500">
            You are currently signed in as a{" "}
            <span className="font-semibold text-foreground capitalize">
              {user.role || "Member"}
            </span>
            . Only verified collaborator profiles can submit job pitches and
            applications to startup founders.
          </p>

          <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row sm:items-center">
            <Link href={`/opportunities/${id}`}>
              <Button
                variant="secondary"
                className="w-full rounded-xl font-semibold sm:w-auto"
              >
                <ArrowLeft size={15} />
                <span>Back to Opportunity</span>
              </Button>
            </Link>

            <Link href={`/login?redirect=/opportunities/${id}/apply`}>
              <Button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/20 sm:w-auto">
                <span>Switch to Collaborator Account</span>
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Quota and plan calculations
  const applications = (await getApplicationsByApplicant(user.id)) || [];
  const plan = {
    name: "Free Tier",
    maxApplicationsPerMonth: 3,
  };

  const usedCount = applications.length;
  const maxQuota = plan.maxApplicationsPerMonth;
  const remainingQuota = Math.max(0, maxQuota - usedCount);
  const quotaPercentage = Math.min(
    100,
    Math.round((usedCount / maxQuota) * 100),
  );
  const hasQuota = usedCount < maxQuota;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Top Quota Usage Banner */}
      <div className="mb-8 rounded-2xl border border-default-200/80 bg-background/80 p-4 shadow-sm backdrop-blur-md transition-colors dark:border-default-100/20 dark:bg-[#0c0c0e]/80 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <TrendingUp size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-default-400">
                  Monthly Quota
                </span>
                <span className="rounded-md bg-default-100 px-2 py-0.5 text-[10px] font-bold text-default-600 dark:bg-default-100/20 dark:text-default-300">
                  {plan.name}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                <span className="text-orange-500 font-bold">{usedCount}</span>{" "}
                of <span className="font-bold">{maxQuota}</span> applications
                used this month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:text-right">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-default-500">
                {hasQuota ? (
                  <span>
                    <strong className="text-foreground">
                      {remainingQuota}
                    </strong>{" "}
                    left for this cycle
                  </span>
                ) : (
                  <span className="font-semibold text-rose-500">
                    Quota Exceeded
                  </span>
                )}
              </span>
              <div className="mt-1.5 h-2 w-32 overflow-hidden rounded-full bg-default-100 dark:bg-default-100/20 sm:w-40">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quotaPercentage >= 100
                      ? "bg-rose-500"
                      : quotaPercentage >= 66
                        ? "bg-amber-500"
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                  }`}
                  style={{ width: `${quotaPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workflow: Application Form or Limit Reached Upsell Card */}
      {hasQuota ? (
        <ApplyForm applicant={user} opportunity={opportunity} />
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-12">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 ring-8 ring-orange-500/5">
              <Lock size={30} />
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>Free Application Limit Reached</span>
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to Expand Your Reach?
            </h2>

            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-default-500">
              You have used all <strong>{maxQuota} applications</strong>{" "}
              available on the Free plan for this billing cycle. Upgrade to
              submit unlimited pitches and connect directly with vetted venture
              founders.
            </p>

            {/* Plan Benefits Checklist */}
            <div className="mt-8 grid w-full max-w-md grid-cols-1 gap-2.5 text-left text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-2.5 dark:border-default-100/10 dark:bg-default-100/10">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Unlimited Applications
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-2.5 dark:border-default-100/10 dark:bg-default-100/10">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Priority Inbox Placement
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-2.5 dark:border-default-100/10 dark:bg-default-100/10">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Direct Founder Messaging
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-2.5 dark:border-default-100/10 dark:bg-default-100/10">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Verified Operator Badge
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row sm:items-center">
              <Link href={`/opportunities/${id}`}>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl font-semibold sm:w-auto"
                >
                  <ArrowLeft size={15} />
                  <span>Back to Opportunity</span>
                </Button>
              </Link>

              <Link href="/plans">
                <Button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] sm:w-auto">
                  <Zap size={15} />
                  <span>View Membership Plans</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

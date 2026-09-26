// app/plans/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Loader2,
  HelpCircle,
  Building2,
  Rocket,
  Crown,
} from "lucide-react";
import { Button, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export const FOUNDER_PLANS = [
  {
    id: "free",
    name: "Free",
    badge: "Starter",
    price: "$0",
    period: "month",
    postLimit: "3 posts / month",
    description:
      "Perfect for new founders hiring their first core collaborator.",
    features: [
      "Up to 3 opportunity listings / month",
      "Standard applicant inbox & review",
      "Public startup profile in directory",
      "Standard community support",
    ],
    ctaText: "Current Tier",
    highlight: false,
    selectable: false,
  },
  {
    id: "premium",
    name: "Premium",
    badge: "Most Popular",
    price: "$19.99",
    period: "month",
    postLimit: "Up to 10 posts / month",
    description:
      "Built for scaling startups building out full engineering & growth pods.",
    features: [
      "Up to 10 opportunity listings / month",
      "Featured listing badge in search results",
      "Direct candidate pitch notes & CV access",
      "Priority applicant inbox notifications",
      "Verified Venture Founder badge",
    ],
    ctaText: "Upgrade to Premium",
    highlight: true,
    selectable: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "Maximum Reach",
    price: "$49.99",
    period: "month",
    postLimit: "Up to 100 posts / month",
    description:
      "For active ventures, studios, and agencies hiring across multiple roles continuously.",
    features: [
      "100 opportunity listings every month",
      "Top-tier pinned placement across all filters",
      "Direct export of applicant contact data",
      "Dedicated talent matching assistance",
      "Priority 24/7 founder support channel",
    ],
    ctaText: "Get Enterprise Unlimited",
    highlight: false,
    selectable: true,
  },
];

const FAQS = [
  {
    q: "How does the monthly post limit reset?",
    a: "Your posting quota resets automatically on the first day of each billing cycle according to your chosen plan.",
  },
  {
    q: "Can I switch between Premium and Enterprise later?",
    a: "Yes. You can upgrade or downgrade your plan at any time through Stripe Checkout, and changes apply immediately.",
  },
  {
    q: "What happens if I reach my monthly post limit?",
    a: "Existing listings remain active and accessible. To publish additional listings before your cycle resets, upgrade to the next tier.",
  },
];

export default function PlansPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const currentPlanId = user?.plan || "free";

  const handleCheckout = async (planId) => {
    setErrorMsg("");

    if (!user) {
      router.push(`/login?redirect=/plans`);
      return;
    }

    if (user.role !== "founder") {
      setErrorMsg("Only founder accounts can purchase posting packages.");
      return;
    }

    setLoadingPlan(planId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to connect to Stripe.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
          <span>Flexible Founder Plans</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Choose the Right Plan for{" "}
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Your Hiring Scale
          </span>
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-default-500 sm:text-base">
          Start on the Free tier with 3 posts per month, or upgrade to recruit
          talent with higher listing limits.
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-danger-500/20 bg-danger-500/10 p-3.5 text-center text-xs font-semibold text-danger-600 dark:text-danger-400">
          {errorMsg}
        </div>
      )}

      {/* Pricing Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {FOUNDER_PLANS.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          const isHighlighted = plan.highlight;
          const isLoading = loadingPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                isHighlighted
                  ? "border-2 border-orange-500 bg-background/95 shadow-2xl shadow-orange-500/15 ring-4 ring-orange-500/10 lg:-translate-y-2 dark:bg-[#0e0e11]"
                  : "border border-default-200/80 bg-background/80 shadow-md backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/80"
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/30">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  {!isHighlighted && (
                    <span className="rounded-lg bg-default-100 px-2.5 py-0.5 text-[11px] font-semibold text-default-500 dark:bg-default-100/20 dark:text-default-400">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-default-500 min-h-[34px]">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1 border-b border-default-200/60 pb-6 dark:border-default-100/15">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-default-400">
                    / {plan.period}
                  </span>
                </div>

                {/* Quota Highlights */}
                <div className="mt-4 rounded-xl border border-default-200/60 bg-default-100/40 p-2.5 text-center dark:border-default-100/10 dark:bg-default-100/10">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {plan.postLimit}
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-default-600 dark:text-default-300"
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isHighlighted
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                {plan.selectable ? (
                  /* 1. Stripe Checkout Form for Paid Plans */
                  <form
                    action="/api/checkout_sessions"
                    method="POST"
                    className="w-full"
                  >
                    {/* Hidden input to pass the selected plan to your backend */}
                    <input type="hidden" name="planId" value={plan.id} />

                    <Button
                      type="submit"
                      role="link"
                      isDisabled={isCurrent}
                      className={`h-12 w-full rounded-2xl font-bold transition-all ${
                        isHighlighted
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:scale-[1.01]"
                          : "bg-default-100 text-foreground hover:bg-default-200 dark:bg-default-100/20"
                      }`}
                    >
                      {isCurrent ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={16} />
                          <span>Active Plan</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {plan.id === "enterprise" ? (
                            <Crown size={16} />
                          ) : (
                            <Zap size={16} />
                          )}
                          <span>{plan.ctaText}</span>
                        </div>
                      )}
                    </Button>
                  </form>
                ) : (
                  /* 2. Free Tier / Current Plan Static Button */
                  <Button
                    variant="secondary"
                    isDisabled={true}
                    className="h-12 w-full rounded-2xl border border-default-200/80 font-semibold opacity-70 dark:border-default-100/20"
                  >
                    {isCurrent ? "Current Plan" : "Default Plan"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Security Banner */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-default-200/60 bg-default-100/30 p-4 text-xs text-default-500 dark:border-default-100/10 dark:bg-default-100/5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Encrypted 256-bit Stripe Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <Rocket size={16} className="text-orange-500" />
          <span>Instant Monthly Post Quota Upgrade</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-amber-500" />
          <span>Cancel or Switch Anytime</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto mt-16 max-w-3xl">
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs text-default-400">
            Common questions regarding founder posting plans and monthly limits.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-default-200/80 bg-background/60 p-5 backdrop-blur-md dark:border-default-100/20 dark:bg-[#0c0c0e]/60"
            >
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <HelpCircle size={15} className="text-orange-500 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2 pl-6 text-xs leading-relaxed text-default-500">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

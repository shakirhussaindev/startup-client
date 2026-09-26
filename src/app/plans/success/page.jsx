// app/plans/success/page.jsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Receipt,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Plus,
  Mail,
  Zap,
} from "lucide-react";
import { Button } from "@heroui/react";
import { stripe } from "@/lib/stripe";

export const metadata = {
  title: "Subscription Confirmed - StartupForge",
  description:
    "Your founder plan subscription has been activated successfully.",
};

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/plans");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
  } catch (error) {
    console.error("Failed to retrieve Stripe session:", error);
    redirect("/plans");
  }

  if (session.status === "open") {
    return redirect("/plans");
  }

  // Extract session details safely
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    "your account email";

  const lineItem = session.line_items?.data?.[0];
  const planTitle = lineItem?.description || "Founder Subscription Plan";
  const amountPaid = session.amount_total
    ? (session.amount_total / 100).toFixed(2)
    : "0.00";
  const currency = (session.currency || "usd").toUpperCase();

  const transactionRef =
    typeof session.payment_intent === "object" && session.payment_intent?.id
      ? session.payment_intent.id
      : session.id;

  const formattedDate = new Date(
    session.created ? session.created * 1000 : Date.now(),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 text-center shadow-2xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-12">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/15 via-orange-500/10 to-amber-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Success Checkmark */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/10 dark:bg-emerald-500/15">
            <CheckCircle2 size={36} />
          </div>

          {/* Status Badge */}
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Plan Activated Successfully</span>
          </div>

          {/* Header Title */}
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Welcome to Your New Tier
          </h1>

          <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-default-500 sm:text-sm">
            Your payment was completed successfully. A receipt and confirmation
            details have been dispatched to{" "}
            <span className="font-semibold text-foreground">
              {customerEmail}
            </span>
            .
          </p>

          {/* ================= RECEIPT CARD ================= */}
          <div className="mt-8 w-full rounded-2xl border border-default-200/80 bg-default-100/40 p-5 text-left dark:border-default-100/15 dark:bg-default-100/10 sm:p-6">
            <div className="flex items-center justify-between border-b border-default-200/60 pb-3.5 dark:border-default-100/15">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-default-500">
                <Receipt size={15} className="text-orange-500" />
                <span>Payment Summary</span>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                PAID
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-default-400">Subscribed Tier</span>
                <span className="font-bold text-foreground">{planTitle}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-default-400">Total Billed</span>
                <span className="font-extrabold text-foreground">
                  ${amountPaid} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-default-400">Billed Account</span>
                <span className="max-w-[200px] truncate font-medium text-foreground sm:max-w-xs">
                  {customerEmail}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-default-400">Payment Date</span>
                <span className="font-medium text-foreground">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-default-200/50 pt-3 text-[11px] dark:border-default-100/15">
                <span className="text-default-400">Transaction ID</span>
                <span className="font-mono text-default-600 dark:text-default-300">
                  {transactionRef.slice(0, 20)}...
                </span>
              </div>
            </div>
          </div>

          {/* ================= UNLOCKED FEATURES HIGHLIGHT ================= */}
          <div className="mt-6 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-3 text-left dark:border-default-100/10 dark:bg-default-100/5">
              <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
              <span className="text-xs font-semibold text-foreground">
                Higher Monthly Posts
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-3 text-left dark:border-default-100/10 dark:bg-default-100/5">
              <Zap size={16} className="shrink-0 text-orange-500" />
              <span className="text-xs font-semibold text-foreground">
                Priority Directory Listing
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-default-200/60 bg-default-100/30 p-3 text-left dark:border-default-100/10 dark:bg-default-100/5">
              <span className="text-xs font-semibold text-foreground">
                Verified Founder Status
              </span>
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/founder/my-opportunities"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                className="h-11 w-full rounded-xl font-semibold sm:w-auto"
              >
                <LayoutDashboard size={15} />
                <span>Go to Dashboard</span>
              </Button>
            </Link>

            <Link
              href="/dashboard/founder/my-opportunities/new"
              className="w-full sm:w-auto"
            >
              <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] sm:w-auto">
                <Plus size={15} />
                <span>Post an Opportunity</span>
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>

          {/* Support Inquiries */}
          <p className="mt-6 text-[11px] text-default-400">
            Have questions about your plan? Contact our team at{" "}
            <a
              href="mailto:support@startupforge.dev"
              className="font-medium text-orange-500 underline underline-offset-2 hover:text-orange-600"
            >
              support@startupforge.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

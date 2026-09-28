// app/startups/page.jsx
import Link from "next/link";
import {
  Rocket,
  Building2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  AlertCircle,
  Layers,
  Search,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { getStartups } from "@/lib/api/startup";

export const metadata = {
  title: "Explore Startups & Ventures - StartupForge",
  description:
    "Discover early-stage startups, explore innovative roadmaps, and connect with visionary founder teams.",
};

const getStatusBadge = (status = "Pending") => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>Verified</span>
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle size={12} className="text-rose-500" />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
          <Clock size={12} className="text-amber-500" />
          <span>Reviewing</span>
        </span>
      );
  }
};

export default async function StartupPage() {
  const startups = (await getStartups()) || [];

  // Summary directory metrics
  const totalStartups = startups.length;
  const verifiedCount = startups.filter(
    (s) => s.status?.toLowerCase() === "approved",
  ).length;

  return (
    <div className="min-h-screen space-y-10 px-4 py-8 sm:px-6 lg:px-8 max-w-10/12 mx-auto">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/90 p-8 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/80 sm:p-12">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-rose-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>Venture Ecosystem Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Discover Next-Gen Ventures
            </h1>
            <p className="text-xs leading-relaxed text-default-500 sm:text-sm">
              Explore high-growth tech ventures, analyze funding milestones, and
              uncover teams building the future of SaaS, AI, and marketplaces.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 text-left dark:border-default-100/15 dark:bg-default-100/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                Total Startups
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">
                {totalStartups}
              </p>
            </div>

            <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 text-left dark:border-default-100/15 dark:bg-default-100/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                Verified Ventures
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">
                {verifiedCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STARTUP DIRECTORY GRID ================= */}
      {startups.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => {
            const startupId = startup._id?.toString() || startup._id;
            const submittedDate = startup.createdAt
              ? new Date(startup.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Recently";

            return (
              <div
                key={startupId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90"
              >
                {/* Top Ambient Card Glow on Hover */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-orange-500/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                <div>
                  {/* Card Header: Avatar + Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-13 w-13 shrink-0 rounded-2xl border border-default-200/70 bg-default-100 shadow-sm ring-2 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10">
                        <Avatar.Image
                          src={startup.logo}
                          alt={startup.name}
                          className="object-cover"
                        />
                        <Avatar.Fallback className="text-sm font-bold text-orange-500">
                          {startup.name
                            ? startup.name.slice(0, 2).toUpperCase()
                            : "ST"}
                        </Avatar.Fallback>
                      </Avatar>

                      <div>
                        <h2 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-orange-500 sm:text-lg">
                          {startup.name}
                        </h2>
                        <span className="text-[11px] text-default-400">
                          Joined {submittedDate}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {getStatusBadge(startup.status)}
                    </div>
                  </div>

                  {/* Badges Bar: Funding Stage & Industry */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {startup.fundingStage && (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-default-200/80 bg-default-100/70 px-2.5 py-1 text-[11px] font-semibold text-foreground dark:border-default-100/20 dark:bg-default-100/10">
                        <TrendingUp size={12} className="text-orange-500" />
                        <span>{startup.fundingStage}</span>
                      </span>
                    )}

                    {startup.industry && (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-default-200/80 bg-default-100/70 px-2.5 py-1 text-[11px] font-medium text-default-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300">
                        <Layers size={12} className="text-default-400" />
                        <span>{startup.industry}</span>
                      </span>
                    )}
                  </div>

                  {/* Startup Pitch / Description */}
                  <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-default-500">
                    {startup.description ||
                      "Innovating disruptive technologies and building specialized infrastructure for high-growth sectors."}
                  </p>
                </div>

                {/* Card Footer: Founder Contact + Details Button */}
                <div className="mt-6 border-t border-default-200/60 pt-4 dark:border-default-100/15">
                  <div className="flex items-center justify-between">
                    <span className="max-w-[140px] truncate text-[11px] text-default-400">
                      {startup.founderEmail || "Confidential Team"}
                    </span>

                    {/* Venture Details Button */}
                    <Link href={`/startups/${startupId}`}>
                      <Button
                        size="sm"
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-orange-500/10 px-3.5 text-xs font-semibold text-orange-600 transition-all hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white"
                      >
                        <span>View Details</span>
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/60 p-12 text-center shadow-xs backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 ring-8 ring-orange-500/5">
            <Rocket size={32} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
            No Startups Published Yet
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-default-500">
            Be the first founder to register your venture profile, recruit
            talent, and access the ecosystem.
          </p>
          <Link href="/dashboard/founder/my-startup" className="mt-6">
            <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20">
              Register Your Startup
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

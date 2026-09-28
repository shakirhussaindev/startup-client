// app/startups/[id]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Mail,
  TrendingUp,
  Layers,
  ShieldCheck,
  Clock,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { getStartupById } from "@/lib/api/startup";

// Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const startup = await getStartupById(id);

  if (!startup) {
    return {
      title: "Startup Not Found - StartupForge",
    };
  }

  return {
    title: `${startup.name} - Startup Details | StartupForge`,
    description:
      startup.description?.slice(0, 160) ||
      `Learn more about ${startup.name}, a venture operating in ${startup.industry}.`,
  };
}

const getStatusBadge = (status = "Pending") => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Verified Venture</span>
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle size={13} className="text-rose-500" />
          <span>Application Rejected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Clock size={13} className="text-amber-500" />
          <span>Pending Review</span>
        </span>
      );
  }
};

export default async function StartupDetailPage({ params }) {
  const { id } = await params;
  const startup = await getStartupById(id);

  if (!startup) {
    notFound();
  }

  const formattedDate = startup.createdAt
    ? new Date(startup.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Added";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 text-xs font-semibold text-default-500 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span>Back to All Startups</span>
        </Link>

        <div className="flex items-center gap-2">
          {getStatusBadge(startup.status)}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90 sm:p-10">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Logo */}
            <Avatar className="h-20 w-20 shrink-0 rounded-2xl border border-default-200/80 bg-default-100 shadow-md ring-2 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10 sm:h-24 sm:w-24">
              <Avatar.Image
                src={startup.logo}
                alt={startup.name}
                className="object-cover"
              />
              <Avatar.Fallback className="text-xl font-bold text-orange-500">
                {startup.name ? startup.name.slice(0, 2).toUpperCase() : "ST"}
              </Avatar.Fallback>
            </Avatar>

            {/* Title & Key Highlights */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {startup.name}
                </h1>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {startup.industry && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/80 bg-default-100/60 px-3 py-1 text-xs font-medium text-default-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300">
                    <Layers size={13} className="text-orange-500" />
                    <span>{startup.industry}</span>
                  </span>
                )}

                {startup.fundingStage && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/80 bg-default-100/60 px-3 py-1 text-xs font-semibold text-foreground dark:border-default-100/20 dark:bg-default-100/10">
                    <TrendingUp size={13} className="text-orange-500" />
                    <span>{startup.fundingStage}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/80 bg-default-100/60 px-3 py-1 text-xs text-default-400 dark:border-default-100/20 dark:bg-default-100/10">
                  <Calendar size={13} />
                  <span>Joined {formattedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Action */}
          <div className="flex items-center gap-3">
            {startup.founderEmail && (
              <a href={`mailto:${startup.founderEmail}`}>
                <Button className="h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01]">
                  <Mail size={15} />
                  <span>Contact Founder</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2/3): Description & Opportunities Callout */}
        <div className="space-y-6 lg:col-span-2">
          {/* About Card */}
          <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90 sm:p-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              About the Venture
            </h2>
            <div className="mt-4 border-t border-default-200/60 pt-4 dark:border-default-100/15">
              <p className="whitespace-pre-line text-sm leading-relaxed text-default-600 dark:text-default-300">
                {startup.description ||
                  "No detailed description provided by the founder yet."}
              </p>
            </div>
          </div>

          {/* Opportunities / Hiring Callout */}
          <div className="flex flex-col gap-4 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6 dark:border-orange-500/15 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400">
                <Briefcase size={18} />
                <h3 className="text-base sm:text-lg">
                  Collaborate with {startup.name}
                </h3>
              </div>
              <p className="text-xs text-default-500 sm:text-sm">
                Explore open positions, technical roles, or co-founder
                opportunities posted by this startup.
              </p>
            </div>

            <Link
              href={`/opportunities?search=${encodeURIComponent(startup.name)}`}
            >
              <Button
                variant="secondary"
                className="h-10 rounded-xl border border-orange-500/30 font-semibold text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
              >
                <span>View Openings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column (1/3): Venture Overview (Fixed Layout) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90">
            <h3 className="text-sm font-bold uppercase tracking-wider text-default-400">
              Venture Overview
            </h3>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              {/* 1. Industry (Fixed: items-start, shrink-0, text-right, gap-4) */}
              <div className="flex items-start justify-between gap-4 border-b border-default-200/60 pb-3 dark:border-default-100/15">
                <span className="shrink-0 text-default-400">Industry</span>
                <span className="text-right font-semibold text-foreground">
                  {startup.industry || "General Tech"}
                </span>
              </div>

              {/* 2. Funding Stage */}
              <div className="flex items-center justify-between gap-4 border-b border-default-200/60 pb-3 dark:border-default-100/15">
                <span className="shrink-0 text-default-400">Funding Stage</span>
                <span className="text-right font-semibold text-foreground">
                  {startup.fundingStage || "Bootstrapped"}
                </span>
              </div>

              {/* 3. Status */}
              <div className="flex items-center justify-between gap-4 border-b border-default-200/60 pb-3 dark:border-default-100/15">
                <span className="shrink-0 text-default-400">Status</span>
                <span className="text-right font-semibold capitalize text-foreground">
                  {startup.status || "Pending"}
                </span>
              </div>

              {/* 4. Contact Email */}
              <div className="flex items-center justify-between gap-4 border-b border-default-200/60 pb-3 dark:border-default-100/15">
                <span className="shrink-0 text-default-400">Contact Email</span>
                <span className="max-w-[180px] truncate text-right font-medium text-foreground">
                  {startup.founderEmail || "Not Disclosed"}
                </span>
              </div>

              {/* 5. Registered Date */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="shrink-0 text-default-400">Registered</span>
                <span className="text-right font-medium text-foreground">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Founder Pitch Note Box */}
            <div className="mt-6 rounded-2xl border border-default-200/70 bg-default-100/50 p-4 text-xs dark:border-default-100/15 dark:bg-default-100/10">
              <span className="font-semibold text-foreground">
                Need to pitch this founder?
              </span>
              <p className="mt-1 leading-relaxed text-default-500">
                Connect directly through verified email inquiries or monitor
                newly published recruitment listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

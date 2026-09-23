// app/opportunities/[id]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Globe,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  Share2,
  AlertCircle,
} from "lucide-react";
import { Button, Avatar } from "@heroui/react";
import { getOpportunityById } from "@/lib/api/opportunities";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    return { title: "Opportunity Not Found - StartupForge" };
  }

  return {
    title: `${opportunity.title} at ${opportunity.startupName} - StartupForge`,
    description: `Explore the ${opportunity.title} position at ${opportunity.startupName}. Apply now to join this early-stage venture.`,
  };
}

export default async function OpportunityDetailPage({ params }) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  // Return standard Next.js 404 page if not found
  if (!opportunity) {
    notFound();
  }

  const {
    _id,
    title,
    skills = [],
    workType = "remote",
    commitment = "full-time",
    deadline,
    status = "Active",
    startupId,
    startupName = "StartupForge Venture",
    StartupIndustry = "Technology",
    startupLogo,
    createdAt,
  } = opportunity;

  // Format dates
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline specified";

  const formattedPostedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isActive = status === "Active" || status === "active";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* ================= 1. BREADCRUMB & BACK NAVIGATION ================= */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/opportunities"
          className="group inline-flex items-center gap-2 text-xs font-semibold text-default-500 transition-colors hover:text-foreground"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span>Back to All Opportunities</span>
        </Link>

        {/* Status Pill */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            isActive
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isActive ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          {isActive ? "Actively Hiring" : "Listing Closed"}
        </span>
      </div>

      {/* ================= 2. MAIN LAYOUT GRID ================= */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: MAIN ROLE & COMPANY DETAILS (8 COLS) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl transition-colors dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 shrink-0 rounded-2xl ring-2 ring-orange-500/30">
                  <Avatar.Image
                    src={startupLogo}
                    alt={startupName}
                    className="object-cover"
                  />
                  <Avatar.Fallback className="text-base font-bold text-orange-500">
                    {startupName?.slice(0, 2).toUpperCase() || "SF"}
                  </Avatar.Fallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {startupName}
                    </span>
                    <span className="text-default-300 dark:text-default-700">
                      •
                    </span>
                    <span className="text-xs text-default-400">
                      {StartupIndustry}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {title}
                  </h1>

                  {formattedPostedDate && (
                    <p className="text-xs text-default-400">
                      Posted on {formattedPostedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-default-200/60 pt-6 sm:grid-cols-3 dark:border-default-100/20">
              <div className="rounded-2xl border border-default-200/60 bg-default-100/40 p-3.5 dark:border-default-100/10 dark:bg-default-100/10">
                <span className="flex items-center gap-1.5 text-xs text-default-500 dark:text-default-400">
                  <Globe size={14} className="text-orange-500" /> Work Type
                </span>
                <p className="mt-1.5 font-bold capitalize text-foreground">
                  {workType}
                </p>
              </div>

              <div className="rounded-2xl border border-default-200/60 bg-default-100/40 p-3.5 dark:border-default-100/10 dark:bg-default-100/10">
                <span className="flex items-center gap-1.5 text-xs text-default-500 dark:text-default-400">
                  <Clock size={14} className="text-orange-500" /> Commitment
                </span>
                <p className="mt-1.5 font-bold capitalize text-foreground">
                  {commitment}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-default-200/60 bg-default-100/40 p-3.5 sm:col-span-1 dark:border-default-100/10 dark:bg-default-100/10">
                <span className="flex items-center gap-1.5 text-xs text-default-500 dark:text-default-400">
                  <Calendar size={14} className="text-orange-500" /> Deadline
                </span>
                <p className="mt-1.5 truncate font-bold text-foreground">
                  {formattedDeadline}
                </p>
              </div>
            </div>
          </div>

          {/* Required Skills Section */}
          <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              <span>Target Expertise & Tech Stack</span>
            </div>

            <h2 className="mt-1 text-lg font-bold text-foreground">
              Required Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-default-400">
                  No specific skills listed for this opportunity.
                </span>
              )}
            </div>
          </div>

          {/* Role Overview & About Section */}
          <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-8">
            <h2 className="text-lg font-bold text-foreground">
              About This Opportunity
            </h2>

            <div className="mt-3 space-y-3 text-sm leading-relaxed text-default-600 dark:text-default-300">
              <p>
                <strong>{startupName}</strong> is actively recruiting a{" "}
                <strong>{title}</strong> to spearhead critical architecture and
                operational pipelines as part of their core team.
              </p>
              <p>
                As an early-stage operator in the{" "}
                <strong>{StartupIndustry}</strong> vertical, you will
                collaborate closely with the founders to build scalable systems,
                solve foundational engineering bottlenecks, and shape the
                long-term technical roadmap.
              </p>
            </div>

            {/* Opportunity Checklist */}
            <div className="mt-6 rounded-2xl border border-default-200/80 bg-default-100/30 p-4 dark:border-default-100/15 dark:bg-default-100/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">
                What to Expect:
              </h3>
              <ul className="mt-2.5 space-y-2 text-xs text-default-600 dark:text-default-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    Direct collaboration with the venture founding team
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    High ownership with tangible product influence from day one
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    Transparent equity and milestone-based commitment structure
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY APPLY CARD & COMPANY SUMMARY (4 COLS) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Primary Action Card */}
            <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90">
              <h3 className="text-base font-bold text-foreground">
                Interested in this role?
              </h3>
              <p className="mt-1 text-xs text-default-500 leading-relaxed">
                Submit your pitch or application directly to the founder of{" "}
                {startupName}.
              </p>

              {/* Apply Button */}
              <div className="mt-5">
                <Link
                  href={`/opportunities/${_id}/apply`}
                  className={!isActive ? "pointer-events-none" : ""}
                >
                  <Button
                    isDisabled={!isActive}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/35"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{isActive ? "Apply Now" : "Position Closed"}</span>
                      {isActive && <ArrowUpRight size={16} />}
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Application Timeline Note */}
              <div className="mt-4 rounded-xl border border-default-100/80 bg-default-100/50 p-3 text-center dark:border-default-100/10 dark:bg-default-100/10">
                <span className="text-[11px] font-semibold text-default-400">
                  Application Closes:
                </span>
                <p className="text-xs font-bold text-foreground">
                  {formattedDeadline}
                </p>
              </div>
            </div>

            {/* Venture Profile Card */}
            <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90">
              <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                About the Venture
              </span>

              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-xl ring-1 ring-default-200">
                  <Avatar.Image src={startupLogo} alt={startupName} />
                  <Avatar.Fallback>{startupName?.slice(0, 2)}</Avatar.Fallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {startupName}
                  </h4>
                  <p className="text-xs text-default-400">{StartupIndustry}</p>
                </div>
              </div>

              {startupId && (
                <div className="mt-5 pt-4 border-t border-default-100/80 dark:border-default-100/10">
                  <Link href={`/startups/${startupId}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full rounded-xl border border-default-200/80 text-xs font-semibold hover:bg-default-100 dark:border-default-100/20"
                    >
                      <Building2 size={14} />
                      <span>View Startup Profile</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

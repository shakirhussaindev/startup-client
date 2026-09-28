// app/dashboard/collaborator/my-applications/page.jsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock4,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ExternalLink,
  FileText,
  Search,
} from "lucide-react";
import { Button } from "@heroui/react";
import { getApplicationsByApplicant } from "@/lib/api/application";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Applications - StartupForge",
  description: "Track and manage your submitted opportunity applications.",
};

const getStatusBadge = (status = "Pending") => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} />
          <span>Accepted</span>
        </span>
      );
    case "shortlisted":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span>Shortlisted</span>
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <XCircle size={13} />
          <span>Not Selected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Clock4 size={13} />
          <span>Pending Review</span>
        </span>
      );
  }
};

export default async function ApplicationsPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login?redirect=/dashboard/collaborator/my-applications");
  }

  const applications =
    (await getApplicationsByApplicant(user.id || user._id)) || [];

  // Summary Metrics
  const totalApplications = applications.length;
  const pendingCount = applications.filter(
    (app) => !app.status || app.status.toLowerCase() === "pending",
  ).length;
  const shortlistedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted",
  ).length;
  const acceptedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "accepted",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Applications
          </h1>
          <p className="mt-1 text-xs text-default-500 sm:text-sm">
            Track pitch statuses, response timelines, and communications from
            startup founders.
          </p>
        </div>

        <Link href="/opportunities">
          <Button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-transform hover:scale-[1.02]"
          >
            <Search size={15} />
            <span>Browse More Roles</span>
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-4 shadow-xs backdrop-blur-xl dark:border-default-100/15 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-default-400">
            Total Pitches
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {totalApplications}
          </p>
        </div>

        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-4 shadow-xs backdrop-blur-xl dark:border-default-100/15 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            In Review
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-4 shadow-xs backdrop-blur-xl dark:border-default-100/15 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
            Shortlisted
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {shortlistedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-default-200/80 bg-background/90 p-4 shadow-xs backdrop-blur-xl dark:border-default-100/15 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            Accepted
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {acceptedCount}
          </p>
        </div>
      </div>

      {/* Main Applications Content */}
      {applications.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 shadow-xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-default-200/60 bg-default-100/40 text-[11px] font-bold uppercase tracking-wider text-default-400 dark:border-default-100/15 dark:bg-default-100/10">
                  <th scope="col" className="px-6 py-4">
                    Opportunity Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Startup
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Applied Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200/60 dark:divide-default-100/15">
                {applications.map((app) => {
                  const appliedDate = app.appliedAt || app.createdAt;
                  const formattedDate = appliedDate
                    ? new Date(appliedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <tr
                      key={app._id?.toString() || app.opportunityId}
                      className="group transition-colors hover:bg-default-100/30 dark:hover:bg-default-100/5"
                    >
                      {/* 1. Opportunity Name */}
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div className="flex flex-col">
                          <Link
                            href={`/opportunities/${app.opportunityId}`}
                            className="inline-flex items-center gap-1.5 font-bold hover:text-orange-500 transition-colors"
                          >
                            <span>{app.opportunityTitle || "Role Title"}</span>
                            <ArrowUpRight
                              size={13}
                              className="text-default-400 group-hover:text-orange-500"
                            />
                          </Link>
                          {app.availability && (
                            <span className="text-[11px] text-default-400 font-normal">
                              Availability: {app.availability}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Startup Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                            <Building2 size={14} />
                          </div>
                          <span className="font-medium text-foreground">
                            {app.startupName || "Startup"}
                          </span>
                        </div>
                      </td>

                      {/* 3. Applied Date */}
                      <td className="px-6 py-4 text-default-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-default-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* 4. Status Badge */}
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* 5. Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {app.resumeLink && (
                            <a
                              href={app.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-default-200/80 bg-default-100/50 px-2.5 py-1 text-[11px] font-medium text-default-600 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-500 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300"
                            >
                              <FileText size={12} />
                              <span>Resume</span>
                              <ExternalLink size={10} />
                            </a>
                          )}

                          <Link href={`/opportunities/${app.opportunityId}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-lg text-xs font-semibold text-foreground hover:bg-default-100 dark:hover:bg-default-100/20"
                            >
                              View Role
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/60 p-12 text-center shadow-xs backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Briefcase size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground sm:text-lg">
            No applications submitted yet
          </h3>
          <p className="mt-1 max-w-sm text-xs text-default-500 leading-relaxed">
            You haven&apos;t pitched or applied for any roles. Discover vetted
            ventures and start contributing to high-growth teams.
          </p>
          <Link href="/opportunities" className="mt-5">
            <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/20">
              Browse Available Opportunities
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

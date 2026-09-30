// app/dashboard/collaborator/page.jsx
import Link from "next/link";
import {
  FileText,
  Globe,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Send,
  Edit3,
  Calendar,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { getUserSession } from "@/lib/core/session";
import { getUserById } from "@/lib/api/users";
import { getApplicationsByApplicant } from "@/lib/api/application";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collaborator Hub - StartupForge",
  description:
    "Manage your collaborator profile, expertise, and track applied opportunities.",
};

// Status Badge Component
const renderStatusBadge = (status = "Pending") => {
  const s = String(status).toLowerCase();

  if (s === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 size={12} />
        <span>Accepted</span>
      </span>
    );
  }

  if (s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
        <XCircle size={12} />
        <span>Rejected</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
      <Clock size={12} />
      <span>Pending</span>
    </span>
  );
};

export default async function CollaboratorHomePage() {
  const sessionUser = await getUserSession();
  const userId = sessionUser?.id || sessionUser?._id;

  const [userInfo, applicationsData] = await Promise.all([
    getUserById(userId).catch(() => sessionUser),
    getApplicationsByApplicant(userId).catch(() => []),
  ]);

  const applications = Array.isArray(applicationsData) ? applicationsData : [];
  const latestApplication = applications[0] || {};

  // Metrics
  const totalApplied = applications.length;
  const pendingCount = applications.filter(
    (app) => (app.status || "Pending").toLowerCase() === "pending",
  ).length;
  const acceptedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "accepted",
  ).length;

  // Skills
  const skillsList = Array.isArray(userInfo?.skills)
    ? userInfo.skills
    : userInfo?.skills
      ? [userInfo.skills]
      : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ================= 1. HEADER ================= */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
              Collaborator Workspace
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Welcome back, {userInfo?.name || "Collaborator"} 
          </h1>
          <p className="text-xs text-default-500 sm:text-sm">
            Your personal profile snapshot and active venture application
            pipeline.
          </p>
        </div>

        <Link
          href="/opportunities"
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
        >
          <Briefcase size={14} />
          <span>Explore Openings</span>
        </Link>
      </div>

      {/* ================= 2. PROFILE & TALENT CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0 rounded-2xl border-2 border-default-200/80 bg-default-100 ring-4 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10">
              <Avatar.Image
                src={userInfo?.image}
                alt={userInfo?.name}
                className="object-cover"
              />
              <Avatar.Fallback className="text-2xl font-black text-orange-500">
                {userInfo?.name
                  ? userInfo.name.slice(0, 2).toUpperCase()
                  : "CO"}
              </Avatar.Fallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {userInfo?.name}
                </h2>
                <span className="rounded-xl border border-default-200/80 bg-default-100/60 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-default-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300">
                  {userInfo?.role || "Collaborator"}
                </span>
              </div>
              <p className="text-xs text-default-400">{userInfo?.email}</p>
              {latestApplication?.availability && (
                <span className="inline-block text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Availability: {latestApplication.availability}
                </span>
              )}
            </div>
          </div>

          <Link href="/profile">
            <Button
              size="sm"
              variant="secondary"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-default-200/80 px-4 text-xs font-semibold text-foreground hover:border-orange-500/40 hover:text-orange-500 dark:border-default-100/20"
            >
              <Edit3 size={13} className="text-orange-500" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>

        {/* Bio */}
        <div className="mt-6 border-t border-default-200/60 pt-4 dark:border-default-100/15">
          <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
            About / Bio
          </span>
          <p className="mt-1 text-xs leading-relaxed text-default-600 dark:text-default-300">
            {userInfo?.bio ||
              "No personal bio added yet. Add a short summary to stand out to founders."}
          </p>
        </div>

        {/* Skills & Portfolio/Resume Links */}
        <div className="mt-5 flex flex-col gap-4 border-t border-default-200/60 pt-4 dark:border-default-100/15 sm:flex-row sm:items-center sm:justify-between">
          {/* Skills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
              Skills & Expertise
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.length > 0 ? (
                skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-default-200/80 bg-default-100/60 px-2.5 py-0.5 text-[11px] font-semibold text-default-700 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-default-400">
                  No skills added yet
                </span>
              )}
            </div>
          </div>

          {/* Resume & Portfolio Links */}
          <div className="flex flex-wrap items-center gap-2">
            {latestApplication?.resumeLink && (
              <a
                href={latestApplication.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/80 bg-default-100/50 px-3 py-1.5 text-xs font-semibold text-default-700 transition-colors hover:border-orange-500/40 hover:text-orange-500 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300"
              >
                <FileText size={13} className="text-orange-500" />
                <span>Resume</span>
                <ExternalLink size={11} className="text-default-400" />
              </a>
            )}

            {latestApplication?.portfolioUrl && (
              <a
                href={latestApplication.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/80 bg-default-100/50 px-3 py-1.5 text-xs font-semibold text-default-700 transition-colors hover:border-emerald-500/40 hover:text-emerald-500 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300"
              >
                <Globe size={13} className="text-emerald-500" />
                <span>Portfolio</span>
                <ExternalLink size={11} className="text-default-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. STATS CARDS ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Applied */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Total Applications
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Send size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              {totalApplied}
            </h3>
            <p className="mt-1 text-xs text-default-400">Ventures applied to</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Under Review
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              {pendingCount}
            </h3>
            <p className="mt-1 text-xs text-default-400">
              Awaiting founder decision
            </p>
          </div>
        </div>

        {/* Accepted Offers */}
        <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 shadow-sm backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Accepted Roles
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              {acceptedCount}
            </h3>
            <p className="mt-1 text-xs text-default-500">
              Approved by venture founders
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. RECENT APPLICATIONS TABLE ================= */}
      <div className="overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
        <div className="flex items-center justify-between border-b border-default-200/60 p-6 dark:border-default-100/15">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Recent Applications ({applications.length})
            </h3>
            <p className="text-xs text-default-500">
              Live status tracking of your submitted pitches and roles.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400"
          >
            <span>Apply to more</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-default-200/60 bg-default-100/40 text-[11px] font-bold uppercase tracking-wider text-default-500 dark:border-default-100/15 dark:bg-default-100/5">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Opportunity & Startup
                </th>
                <th scope="col" className="px-6 py-4">
                  Applied Date
                </th>
                <th scope="col" className="px-6 py-4">
                  Pitch Note
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-200/60 dark:divide-default-100/10">
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-xs text-default-400"
                  >
                    You have not applied to any startup opportunities yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const appliedDate =
                    app.appliedAt || app.createdAt
                      ? new Date(
                          app.appliedAt || app.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently";

                  return (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-default-100/30 dark:hover:bg-default-100/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {app.opportunityTitle}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-default-400">
                            <Building2 size={11} className="text-orange-500" />
                            {app.startupName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-default-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-default-400" />
                          <span>{appliedDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs text-default-600 dark:text-default-300">
                        <span
                          className="line-clamp-1 italic"
                          title={app.pitchNote}
                        >
                          &ldquo;{app.pitchNote || "No pitch note"}&rdquo;
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {renderStatusBadge(app.status)}
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

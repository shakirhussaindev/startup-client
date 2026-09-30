// app/dashboard/founder/page.jsx
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  ArrowRight,
  Building2,
} from "lucide-react";
import { getFounderApplications } from "@/lib/api/application";
import { getStartupOpportunities } from "@/lib/api/opportunities";
import { getLoggedInFounderStartup } from "@/lib/api/startup";
import { getUserSession } from "@/lib/core/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Founder Dashboard - StartupForge",
  description:
    "Quick performance overview of your startup opportunities and applicants.",
};

const FounderHomePage = async () => {
  const user = await getUserSession();
  const startup = await getLoggedInFounderStartup();

 
  if (!startup?._id) {
    return (
      <div className="mx-auto max-w-5xl p-6 sm:p-8">
        <div className="rounded-3xl border border-default-200/80 bg-background/50 p-12 text-center backdrop-blur-xl dark:border-default-100/15">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Building2 size={28} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            No Startup Registered Yet
          </h2>
          <p className="mt-1 text-xs text-default-500">
            Register your startup to publish opportunities and receive applicant
            proposals.
          </p>
          <Link
            href="/dashboard/founder/my-startup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:scale-[1.01] transition-transform"
          >
            <span>Register Startup Profile</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  
  const [opportunitiesData, applicationsData] = await Promise.all([
    getStartupOpportunities(startup._id).catch(() => []),
    getFounderApplications(startup._id).catch(() => []),
  ]);

  const opportunities = Array.isArray(opportunitiesData)
    ? opportunitiesData
    : [];
  const applications = Array.isArray(applicationsData) ? applicationsData : [];

  // ================= METRICS CALCULATIONS =================
  const totalOpportunities = opportunities.length;
  const totalApplications = applications.length;
  const acceptedMembers = applications.filter(
    (app) => app.status?.toLowerCase() === "accepted",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 mr-10">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
              
              Founder Workspace
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-xs text-default-500 sm:text-sm">
            Performance summary for{" "}
            <strong className="text-foreground">{startup.name}</strong>
          </p>
        </div>
      </div>

      {/* 3 Minimal Overview Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* 1. Total Opportunities */}
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Total Opportunities
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {totalOpportunities}
            </h2>
            <Link
              href="/dashboard/founder/my-opportunities"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400"
            >
              <span>Manage roles</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* 2. Total Applications */}
        <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Total Applications
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {totalApplications}
            </h2>
            <Link
              href="/dashboard/founder/applications"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>Review candidates</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* 3. Accepted Members */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 shadow-sm backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#0c0c0e]/95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Accepted Members
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {acceptedMembers}
            </h2>
            <p className="mt-2 text-xs text-default-500">
              Active team & collaborators on board
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderHomePage;

// app/dashboard/founder/applications/page.jsx
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getFounderStartup } from "@/lib/api/startup";
import { getFounderApplications } from "@/lib/api/application";
import ApplicationsTable from "@/components/dashboard/founder/ApplicationsTable";

export const metadata = {
  title: "Candidate Applications - Founder Workspace",
  description:
    "Review collaborator applications, examine resumes, and manage acceptances.",
};

const ApplicationsPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/unauthorized?from=/dashboard/founder/applications");
  }

  const startup = await getFounderStartup(user.id || user._id);


  const founderApplication = (await getFounderApplications(startup._id)) || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header & Stats Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Candidate Applications
          </h1>
          <p className="mt-1 text-xs text-default-500 sm:text-sm">
            Review applicant proposals for{" "}
            <strong className="text-foreground">{startup.name}</strong>, inspect
            CVs, and accept or reject candidates.
          </p>
        </div>

        {/* Quick Counter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl border border-default-200/70 bg-default-100/50 px-3 py-1.5 text-xs font-semibold text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300">
            Total: {founderApplication.length}
          </span>
          <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending:{" "}
            {founderApplication.filter((a) => a.status === "Pending").length}
          </span>
          <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Accepted:{" "}
            {founderApplication.filter((a) => a.status === "Accepted").length}
          </span>
        </div>
      </div>

      {/* Applications Table Component */}
      <ApplicationsTable initialApplications={founderApplication} />
    </div>
  );
};

export default ApplicationsPage;

// app/dashboard/admin/startups/page.jsx
import { getStartups } from "@/lib/api/startup";
import StartupsApprovalTable from "./StartupsApprovalTable";

export const metadata = {
  title: "Manage Startups - Admin Workspace",
};

export default async function ManageStartupsPage() {
  const startups = (await getStartups()) || [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Manage Startups
        </h1>
        <p className="mt-1 text-xs text-default-500 sm:text-sm">
          Review, approve, or reject venture submissions to regulate platform
          quality.
        </p>
      </div>

      <StartupsApprovalTable initialStartups={startups} />
    </div>
  );
}

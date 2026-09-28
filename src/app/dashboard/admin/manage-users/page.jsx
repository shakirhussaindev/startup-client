// app/dashboard/admin/users/page.jsx
import { getUserList } from "@/lib/api/users";
import ManageUsersTable from "@/components/dashboard/admin/ManageUsersTable";

export const metadata = {
  title: "Manage Users - Admin Workspace",
  description:
    "Monitor registered accounts, toggle bans, and manage user access.",
};

export default async function UserManagementPage() {
  const data = await getUserList();
  const users = data?.users || [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-xs text-default-500 sm:text-sm">
          View registered users, inspect account statuses, filter by date, and
          enforce access restrictions.
        </p>
      </div>

      <ManageUsersTable initialUsers={users} />
    </div>
  );
}

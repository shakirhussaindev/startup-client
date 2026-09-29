// app/profile/page.jsx
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import ProfileClient from "./ProfileClient";
import { getUserById } from "@/lib/api/users";

export const metadata = {
  title: "My Profile - StartupForge",
  description:
    "View and manage your personal account settings and role attributes.",
};

export default async function ProfilePage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/unauthorized?from=/profile");
  }
  const userId = user?.id

  const userInfo = await getUserById(userId)
  console.log('userInfo',userInfo)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Account Profile
        </h1>
        <p className="mt-1 text-xs text-default-500 sm:text-sm">
          Manage your personal identity, display preferences, and role
          credentials.
        </p>
      </div>

      {/* Interactive Profile View & Form */}
      <ProfileClient user={userInfo} />
    </div>
  );
}

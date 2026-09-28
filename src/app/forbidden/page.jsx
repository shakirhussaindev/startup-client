
import Link from "next/link";
import { ShieldAlert, Home, LayoutDashboard, LogIn, Lock } from "lucide-react";
import { Button } from "@heroui/react";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "403 Forbidden - StartupForge",
  description: "You do not have permission to access this workspace.",
};

export default async function ForbiddenPage({ searchParams }) {
  const { requiredRole, from } = await searchParams;
  const user = await getUserSession();

  const userRole = user?.role || "guest";
  const targetRole = requiredRole || "different";

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-500/15 via-orange-500/10 to-amber-500/15 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-12">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5 dark:bg-rose-500/15">
          <ShieldAlert size={40} strokeWidth={2.2} />
        </div>

        {/* Status Pill - 403 Forbidden */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
          <Lock size={12} />
          <span>403 • Forbidden (Access Denied)</span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-default-500 sm:text-sm">
          {requiredRole ? (
            <>
              This workspace is reserved exclusively for verified{" "}
              <strong className="capitalize text-foreground">
                {targetRole}
              </strong>{" "}
              accounts. You are currently authenticated as a{" "}
              <strong className="capitalize text-foreground">{userRole}</strong>
              .
            </>
          ) : (
            <>
              You do not have the required permissions to access this resource.
              Please switch to an authorized account or return to your
              dashboard.
            </>
          )}
        </p>

        {/* Account Info */}
        {user && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-default-200/70 bg-default-100/40 px-4 py-2 text-xs font-medium text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300">
            <span>Signed in as:</span>
            <span className="font-bold text-foreground">{user.email}</span>
            <span className="rounded-md bg-default-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-default-700 dark:bg-default-100/20 dark:text-default-300">
              {userRole}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href={
              userRole === "founder"
                ? "/dashboard/founder"
                : userRole === "collaborator"
                  ? "/dashboard/collaborator"
                  : "/"
            }
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              className="h-11 w-full rounded-xl font-semibold sm:w-auto"
            >
              <LayoutDashboard size={15} />
              <span>Go to Dashboard</span>
            </Button>
          </Link>

          <Link
            href={`/login?redirect=${encodeURIComponent(from || "/")}`}
            className="w-full sm:w-auto"
          >
            <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] sm:w-auto">
              <LogIn size={15} />
              <span>Switch Account</span>
            </Button>
          </Link>
        </div>

        <div className="mt-8 border-t border-default-200/60 pt-5 dark:border-default-100/20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-default-400 transition-colors hover:text-foreground"
          >
            <Home size={13} />
            <span>Return to StartupForge Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

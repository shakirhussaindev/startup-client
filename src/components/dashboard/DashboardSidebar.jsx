"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Rocket,
  Settings2,
  PlusCircle,
  Briefcase,
  FileText,
  LogOut,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { BsLayoutSidebar } from "react-icons/bs";
import { Button, Drawer, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  {
    label: "Overview",
    href: `/dashboard/founder`,
    icon: LayoutDashboard,
  },
  {
    label: "My Startup",
    href: "/dashboard/founder/my-startup",
    icon: Rocket,
  },
  {
    label: "Manage Startup",
    href: "/dashboard/manage-startup",
    icon: Settings2,
  },
  {
    label: "Add Opportunity",
    href: "/dashboard/opportunities/new",
    icon: PlusCircle,
  },
  {
    label: "Manage Opportunities",
    href: "/dashboard/opportunities",
    icon: Briefcase,
  },
  {
    label: "Applications",
    href: "/dashboard/applications",
    icon: FileText,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth Session Hook
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const getInitials = (name) => {
    if (!name?.trim()) return "SF";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Reusable Navigation Content
  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 shadow-sm shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
              <Flame className="h-4 w-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Startup
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Forge
              </span>
            </span>
          </Link>
        </div>

        {/* Back to website button */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-default-500 transition-colors hover:bg-default-100 hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span>Back to Main Website</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <span className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-default-400">
            Workspace
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            // Matches exact route or sub-paths (for opportunities/new)
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-orange-500/10 font-semibold text-orange-600 dark:text-orange-400"
                    : "text-default-600 hover:bg-default-100/70 hover:text-foreground dark:text-default-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-default-400 group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout Footer */}
      <div className="border-t border-default-200/60 pt-4 dark:border-default-100/20">
        <div className="mb-2 flex items-center gap-3 rounded-2xl bg-default-100/40 p-2.5 dark:bg-default-100/10">
          <Avatar className="h-9 w-9 shrink-0 ring-1 ring-default-200 dark:ring-default-800">
            <Avatar.Image
              src={
                user?.image ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "SF"}`
              }
              alt={user?.name || "User Avatar"}
            />
            <Avatar.Fallback className="text-xs font-bold text-orange-500">
              {getInitials(user?.name)}
            </Avatar.Fallback>
          </Avatar>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-semibold text-foreground">
                {user?.name || "Founder"}
              </span>
              <span className="rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-orange-600 dark:text-orange-400">
                {user?.role || "Founder"}
              </span>
            </div>
            <span className="truncate text-[11px] text-default-400">
              {user?.email || "founder@startupforge.dev"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-default-200/60 bg-background/95 p-4 backdrop-blur-xl transition-colors dark:border-default-100/20 lg:flex">
        {navContent}
      </aside>

      {/* Mobile Drawer Trigger Bar */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-default-200/60 bg-background/95 px-4 backdrop-blur-md lg:hidden dark:border-default-100/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600">
            <Flame className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Startup<span className="text-orange-500">Forge</span>
          </span>
        </Link>

        {/* Hero UI v3 Drawer Component */}
        <Drawer>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Open sidebar"
            className="flex items-center gap-2 rounded-xl border border-default-200/80 bg-background text-foreground hover:bg-default-100"
          >
            <BsLayoutSidebar size={15} />
            <span className="text-xs font-semibold">Menu</span>
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content
              placement="left"
              className="max-w-[280px] p-4 bg-background"
            >
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header className="sr-only">
                  <Drawer.Heading>Dashboard Navigation</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body className="p-0 pt-2 h-full">
                  {navContent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}

// components/dashboard/DashboardNavbar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Button, Dropdown, Label, Avatar } from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import ThemeIconButton from "@/components/ThemeIconButton";

const publicNavLinks = [
  { name: "Home", href: "/" },
  { name: "Startups", href: "/startups" },
  { name: "Opportunities", href: "/opportunities" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth session hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Handle Logout
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

  // Safe initials generator for fallback
  const getInitials = (name) => {
    if (!name) return "SF";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-default-200/50 bg-background/80 backdrop-blur-xl transition-colors dark:border-default-100/15">
      {/* 
        Container matching page content perfectly:
        mx-auto max-w-6xl px-4 sm:px-6 lg:px-8
      */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:mr-30">
        
        {/* ================= LEFT: REFINED BREADCRUMB BADGE ================= */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-default-200/70 bg-default-100/40 py-1 pl-2.5 pr-3 shadow-xs dark:border-default-100/20 dark:bg-default-100/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-default-500">
              Workspace
            </span>
            <span className="text-default-300 dark:text-default-700">/</span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
              {user?.role ? user.role.toUpperCase() : "FOUNDER"}
            </span>
          </div>
        </div>

        {/* ================= MIDDLE: PUBLIC NAV LINKS ================= */}
        <div className="hidden items-center gap-1 md:flex">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-default-500 hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="dashboardNavActivePill"
                    className="absolute inset-0 -z-10 rounded-full bg-default-100/80 dark:bg-default-100/30"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ================= RIGHT: SEARCH, NOTIFICATIONS, THEME & USER ================= */}
        <div className="flex items-center gap-2.5">
          
         

          {/* Theme Toggle Button */}
          <ThemeIconButton />

          {/* Vertical subtle divider */}
          <div className="h-5 w-px bg-default-200/80 dark:bg-default-100/20 mx-0.5" />

          {/* Authenticated User Profile Dropdown */}
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-default-200/60 dark:bg-default-100/20" />
          ) : user ? (
            <Dropdown>
              <Button
                variant="ghost"
                aria-label="User profile menu"
                className="group flex h-9 items-center gap-2 rounded-full border border-default-200/80 bg-default-100/60 pl-1 pr-2.5 transition-all duration-200 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-sm hover:shadow-orange-500/10 dark:border-default-100/30 dark:bg-default-100/20 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/15"
              >
                <Avatar className="h-7 w-7 ring-1 ring-default-300/60 dark:ring-default-700">
                  <Avatar.Image
                    src={
                      user.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                    }
                    alt={user.name || "User Avatar"}
                  />
                  <Avatar.Fallback className="text-[11px] font-bold text-orange-500">
                    {getInitials(user.name)}
                  </Avatar.Fallback>
                </Avatar>

                {/* Dropdown Chevron with subtle hover animation */}
                <ChevronDown
                  size={14}
                  className="text-default-500 transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-orange-500 dark:text-default-400 dark:group-hover:text-orange-400"
                />
              </Button>

              <Dropdown.Popover className="min-w-56 p-1.5 shadow-2xl backdrop-blur-xl">
                <Dropdown.Menu
                  aria-label="User actions"
                  onAction={(key) => {
                    if (key === "dashboard") router.push("/dashboard/founder");
                    if (key === "startup") router.push("/dashboard/founder/my-startup");
                    if (key === "profile") router.push("/profile");
                    if (key === "logout") handleLogout();
                  }}
                >
                  <Dropdown.Item
                    id="user-info"
                    textValue={user.name}
                    isReadOnly
                    className="mb-1 cursor-default border-b border-default-100 pb-2 opacity-100 hover:bg-transparent"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <p className="max-w-[130px] truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </p>
                        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                          {user.role || "Founder"}
                        </span>
                      </div>
                      <p className="truncate text-xs text-default-500">
                        {user.email}
                      </p>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                    className="gap-2.5"
                  >
                    <LayoutDashboard size={15} className="text-default-500" />
                    <Label className="cursor-pointer font-medium text-xs">
                      Dashboard Overview
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="gap-2.5"
                  >
                    <User size={15} className="text-default-500" />
                    <Label className="cursor-pointer font-medium text-xs">
                      My Profile
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    className="mt-1 gap-2.5 border-t border-default-100/80 pt-2 font-medium text-danger"
                  >
                    <LogOut size={15} />
                    <Label className="cursor-pointer font-semibold text-xs">
                      Sign Out
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : null}
        </div>

      </div>
    </header>
  );
}
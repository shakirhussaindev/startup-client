// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ArrowRight,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button, Dropdown, Label, Avatar } from "@heroui/react";

// Import your Better Auth client
import { authClient } from "@/lib/auth-client";

// ThemeIconButton ইমপোর্ট
import ThemeIconButton from "./ThemeIconButton";

const publicNavLinks = [
  { name: "Home", href: "/" },
  { name: "Startups", href: "/startups" },
  { name: "Opportunities", href: "/opportunities" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Better Auth session hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  // Safe user initials fallback
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
    <header className="sticky top-0 z-50 w-full border-b border-default-200/50 bg-background/75 backdrop-blur-xl transition-colors dark:border-default-100/20">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LEFT: BRAND LOGO ================= */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.2} />
            <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-40" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Startup
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Forge
            </span>
          </span>
        </Link>

        {/* ================= MIDDLE: DESKTOP NAV LINKS ================= */}
        <div className="hidden items-center gap-1 md:flex">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary dark:text-orange-400 font-semibold"
                    : "text-default-600 hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 -z-10 rounded-full bg-default-100/80 dark:bg-default-100/40"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ================= RIGHT: THEME TOGGLE & AUTH ================= */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeIconButton />

          {/* Skeleton placeholder while session loads */}
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-18 rounded-lg bg-default-200/60 animate-pulse" />
              <div className="h-9 w-24 rounded-lg bg-default-200/60 animate-pulse" />
            </div>
          ) : user ? (
            /* Authenticated: Hero UI v3 Dropdown & Avatar with Arrow */
            <Dropdown>
              <Button
                variant="ghost"
                aria-label="User profile menu"
                className="group flex h-9 items-center gap-2 rounded-full border border-default-200/80 bg-default-100/60 pl-1 pr-2.5 transition-all duration-200 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-sm hover:shadow-orange-500/10 dark:border-default-100/30 dark:bg-default-100/20 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/15"
              >
                <Avatar className="h-8 w-8">
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

                {/* Dropdown Arrow */}
                <ChevronDown
                  size={14}
                  className="text-default-500 transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-orange-500 dark:text-default-400 dark:group-hover:text-orange-400"
                />
              </Button>

              <Dropdown.Popover className="min-w-56 p-1.5 shadow-xl">
                <Dropdown.Menu
                  aria-label="User actions"
                  onAction={(key) => {
                    if (key === "dashboard") router.push("/dashboard");
                    if (key === "profile") router.push("/profile");
                    if (key === "logout") handleLogout();
                  }}
                >
                  <Dropdown.Item
                    id="user-info"
                    textValue={user.name}
                    isReadOnly
                    className="cursor-default border-b border-default-100 pb-2 mb-1 opacity-100 hover:bg-transparent"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground truncate max-w-[130px]">
                          {user.name}
                        </p>
                        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                          {user.role || "Founder"}
                        </span>
                      </div>
                      <p className="text-xs text-default-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                    className="gap-2.5"
                  >
                    <LayoutDashboard size={16} className="text-default-500" />
                    <Label className="cursor-pointer font-medium">
                      Dashboard
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="gap-2.5"
                  >
                    <User size={16} className="text-default-500" />
                    <Label className="cursor-pointer font-medium">
                      Profile
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    className="gap-2.5 text-danger font-medium border-t border-default-100/80 mt-1 pt-2"
                  >
                    <LogOut size={16} />
                    <Label className="cursor-pointer font-semibold">
                      Sign Out
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            /* Unauthenticated: Login & Get Started CTAs */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-default-700 hover:text-foreground rounded-lg"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/35"
                >
                  <span>Get Started</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ================= MOBILE CONTROLS ================= */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeIconButton />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle navigation menu"
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 min-w-9 p-0 text-foreground"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </nav>

      {/* ================= MOBILE EXPANDABLE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-default-200/60 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col space-y-4 px-5 pt-3 pb-6">
              {/* Authenticated User Status Card */}
              {user && (
                <div className="flex items-center gap-3 rounded-2xl bg-default-100/60 p-3 ring-1 ring-default-200/50">
                  <Avatar className="h-11 w-11">
                    <Avatar.Image
                      src={
                        user.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                      }
                      alt={user.name || "User Avatar"}
                    />
                    <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {user.name}
                      </span>
                      <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                        {user.role || "Founder"}
                      </span>
                    </div>
                    <span className="text-xs text-default-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}

              {/* Public Links */}
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-default-400 px-2 pb-1">
                  Navigation
                </span>
                {publicNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold"
                          : "text-default-700 hover:bg-default-100"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="opacity-40" />
                    </Link>
                  );
                })}
              </div>

              {/* Authenticated Member Actions */}
              {user ? (
                <div className="flex flex-col space-y-1 border-t border-default-100 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-default-400 px-2 pb-1">
                    Account
                  </span>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-default-700 hover:bg-default-100"
                  >
                    <LayoutDashboard size={18} className="text-default-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-default-700 hover:bg-default-100"
                  >
                    <User size={18} className="text-default-500" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated Mobile Actions */
                <div className="flex flex-col gap-2 pt-2 border-t border-default-100">
                  <Link href="/login">
                    <Button
                      variant="secondary"
                      className="w-full font-semibold"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/20">
                      <span>Get Started</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

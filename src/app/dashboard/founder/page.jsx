// app/dashboard/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  UserCheck,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DashboardOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Stat metrics data
  const stats = [
    {
      title: "Total Opportunities",
      value: "8",
      subtext: "3 currently accepting applicants",
      change: "+2 this month",
      icon: Briefcase,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      href: "/dashboard/opportunities",
    },
    {
      title: "Total Applications",
      value: "34",
      subtext: "12 pending review",
      change: "+8 this week",
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/dashboard/applications",
    },
    {
      title: "Accepted Members",
      value: "6",
      subtext: "Active across your venture",
      change: "+1 joined recently",
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/dashboard/startup",
    },
  ];

  // Sample recent applicants
  const recentApplicants = [
    {
      name: "Tariqul Islam",
      role: "Lead Full-Stack Engineer",
      appliedDate: "2 hours ago",
      status: "Under Review",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tariqul",
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Product Designer",
      appliedDate: "1 day ago",
      status: "Accepted",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah",
    },
    {
      name: "Arif Rahman",
      role: "Growth & Marketing Lead",
      appliedDate: "3 days ago",
      status: "Pending",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Arif",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ================= 1. WELCOME HEADER ================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {user?.name ? user.name.split(" ")[0] : "Founder"}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <Sparkles size={12} />
              {user?.role || "Founder"}
            </span>
          </div>
          <p className="mt-1 text-sm text-default-500">
            Here is what is happening with your venture and open positions
            today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href="/dashboard/opportunities/new"
            className="group flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-orange-500/30"
          >
            <Plus
              size={16}
              className="transition-transform group-hover:rotate-90 duration-200"
            />
            <span>Post Opportunity</span>
          </Button>
        </div>
      </motion.div>

      {/* ================= 2. CORE STATS CARDS ================= */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-default-200/60 bg-background/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 dark:border-default-100/30"
            >
              {/* Top Row: Icon & Link Indicator */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-default-100/70 text-default-400 transition-all group-hover:bg-orange-500 group-hover:text-white dark:bg-default-100/20">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Middle: Metric Figure */}
              <div className="mt-5">
                <span className="text-xs font-bold uppercase tracking-wider text-default-400">
                  {stat.title}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                    {stat.value}
                  </span>
                </div>
              </div>

              {/* Bottom: Context / Change */}
              <div className="mt-4 flex items-center justify-between border-t border-default-100/80 pt-3 dark:border-default-100/20">
                <span className="text-xs text-default-500">{stat.subtext}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* ================= 3. LOWER SPLIT: RECENT ACTIVITY & QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Applications (Spans 2 columns) */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-default-200/60 bg-background/80 p-6 backdrop-blur-md lg:col-span-2 dark:border-default-100/30"
        >
          <div className="flex items-center justify-between pb-4 border-b border-default-100 dark:border-default-100/20">
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                Recent Applications
              </h2>
              <p className="text-xs text-default-500">
                Candidates who recently applied to your roles
              </p>
            </div>
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-default-100 dark:divide-default-100/20">
            {recentApplicants.map((applicant, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3.5 transition-colors hover:bg-default-100/30 -mx-2 px-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0 ring-1 ring-default-200">
                    <Avatar.Image src={applicant.avatar} alt={applicant.name} />
                    <Avatar.Fallback>{applicant.name[0]}</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {applicant.name}
                    </h3>
                    <p className="text-xs text-default-500">{applicant.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      applicant.status === "Accepted"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : applicant.status === "Under Review"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "bg-default-100 text-default-600 dark:bg-default-100/30"
                    }`}
                  >
                    {applicant.status}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] text-default-400">
                    {applicant.appliedDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Venture Hub (Spans 1 column) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-between rounded-3xl border border-default-200/60 bg-background/80 p-6 backdrop-blur-md dark:border-default-100/30"
        >
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Startup Health
            </h2>
            <p className="text-xs text-default-500">
              Venture progress and team formation checklist
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-default-100/50 p-3 dark:bg-default-100/20">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 text-emerald-500 shrink-0"
                />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Startup Profile Active
                  </p>
                  <p className="text-default-500">
                    Pitch deck and overview visible
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-default-100/50 p-3 dark:bg-default-100/20">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 text-emerald-500 shrink-0"
                />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Co-founder Equity Model
                  </p>
                  <p className="text-default-500">
                    Standard 4-year vesting configured
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-default-100/50 p-3 dark:bg-default-100/20">
                <Clock size={18} className="mt-0.5 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Awaiting Technical Lead
                  </p>
                  <p className="text-default-500">
                    Review pending engineer profiles
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            as={Link}
            href="/dashboard/manage-startup"
            variant="secondary"
            className="mt-6 w-full !rounded-xl text-xs font-semibold"
          >
            Manage Venture Settings
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// components/dashboard/admin/AdminStatsCharts.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Building2, TrendingUp, BarChart3, Layers } from "lucide-react";

// Color Palettes
const COLORS = [
  "#f97316",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#6366f1",
];
const PLAN_PRICES = { premium: 19.99, enterprise: 49.99 };

// ================= THEME SAFE TOOLTIP =================
const CustomTooltip = ({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const valueColor = data.color || data.payload?.fill || "#10b981";

    return (
      <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900">
        {/* Date / Category Title */}
        <p className="text-xs font-bold text-gray-800 dark:text-zinc-100">
          {label || data.name}
        </p>
        {/* Dynamic Amount / Count */}
        <p
          className="mt-1 text-sm font-extrabold tracking-tight"
          style={{ color: valueColor }}
        >
          {prefix}
          {Number(data.value).toLocaleString()}
          {suffix}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend Label Formatter
const renderLegendText = (value) => {
  return (
    <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">
      {value}
    </span>
  );
};

export default function AdminStatsCharts({
  users = [],
  startups = [],
  opportunities = [],
  subscriptions = [],
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 1. Total Revenue & Calculations
  const { totalRevenue, revenueTimeline, planDistribution } = useMemo(() => {
    let rev = 0;
    let premiumCount = 0;
    let enterpriseCount = 0;

    const sortedSubs = [...subscriptions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    let cumulative = 0;
    const timelineMap = {};

    sortedSubs.forEach((sub) => {
      const plan = sub.planId?.toLowerCase();
      const amount = PLAN_PRICES[plan] || 0;
      rev += amount;
      cumulative += amount;

      if (plan === "enterprise") enterpriseCount++;
      else premiumCount++;

      const dateStr = sub.createdAt
        ? new Date(sub.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Initial";

      timelineMap[dateStr] = Number(cumulative.toFixed(2));
    });

    const timelineData = Object.keys(timelineMap).map((date) => ({
      date,
      revenue: timelineMap[date],
    }));

    return {
      totalRevenue: rev,
      revenueTimeline:
        timelineData.length > 0
          ? timelineData
          : [{ date: "Today", revenue: 0 }],
      planDistribution: [
        { name: "Premium ($19.99)", value: premiumCount },
        { name: "Enterprise ($49.99)", value: enterpriseCount },
      ],
    };
  }, [subscriptions]);

  // 2. Users by Role Distribution
  const userRolesData = useMemo(() => {
    const rolesCount = {};
    users.forEach((u) => {
      const role = u.role
        ? u.role.charAt(0).toUpperCase() + u.role.slice(1)
        : "User";
      rolesCount[role] = (rolesCount[role] || 0) + 1;
    });

    return Object.keys(rolesCount).map((role) => ({
      name: role,
      value: rolesCount[role],
    }));
  }, [users]);

  // 3. Startups by Industry Distribution
  const startupIndustryData = useMemo(() => {
    const map = {};
    startups.forEach((s) => {
      const ind = s.industry || "Other";
      map[ind] = (map[ind] || 0) + 1;
    });

    return Object.keys(map)
      .map((key) => ({ name: key, count: map[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [startups]);

  // 4. Startups by Funding Stage
  const fundingStageData = useMemo(() => {
    const map = {};
    startups.forEach((s) => {
      const stage = s.fundingStage || "Idea";
      map[stage] = (map[stage] || 0) + 1;
    });

    return Object.keys(map).map((stage) => ({
      stage,
      startups: map[stage],
    }));
  }, [startups]);

  if (!mounted) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-xs text-default-400">
        Loading interactive charts...
      </div>
    );
  }

  // Axis Font & Color Styling
  const axisTickStyle = { fill: "#71717a", fontSize: 11 };

  return (
    <div className="space-y-8">
      {/* ================= 1. REVENUE GROWTH TIMELINE ================= */}
      <div className="overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
        <div className="flex flex-col gap-1 border-b border-default-200/60 pb-5 dark:border-default-100/15 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                Cumulative Revenue Growth
              </h2>
              <p className="text-xs text-default-500">
                Total earnings trajectory from Stripe subscription checkouts
                ($).
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-default-400">Current Total</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTimeline}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#71717a"
                opacity={0.15}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={axisTickStyle}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={axisTickStyle}
                tickFormatter={(val) => `$${val}`}
              />
              {/* Tooltip with clean cursor line */}
              <Tooltip
                content={<CustomTooltip prefix="$" />}
                cursor={{
                  stroke: "#10b981",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= 2. USER ROLES & SUBSCRIPTION TIERS ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Roles */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
          <div className="flex items-center gap-3 border-b border-default-200/60 pb-4 dark:border-default-100/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                User Roles Distribution
              </h3>
              <p className="text-xs text-default-500">
                Ratio of Founders, Collaborators & Admins
              </p>
            </div>
          </div>

          <div className="mt-6 flex h-64 w-full items-center justify-center">
            {userRolesData.length === 0 ? (
              <span className="text-xs text-default-400">
                No user data available
              </span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={userRolesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={renderLegendText}
                    wrapperStyle={{ paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
          <div className="flex items-center gap-3 border-b border-default-200/60 pb-4 dark:border-default-100/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Subscription Tiers
              </h3>
              <p className="text-xs text-default-500">
                Premium vs Enterprise member counts
              </p>
            </div>
          </div>

          <div className="mt-6 flex h-64 w-full items-center justify-center">
            {subscriptions.length === 0 ? (
              <span className="text-xs text-default-400">
                No subscription records
              </span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip suffix=" subs" />} />
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#f59e0b" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={renderLegendText}
                    wrapperStyle={{ paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. INDUSTRY & FUNDING STAGES ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Industry */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
          <div className="flex items-center gap-3 border-b border-default-200/60 pb-4 dark:border-default-100/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Startups by Industry
              </h3>
              <p className="text-xs text-default-500">
                Leading startup sectors on the platform
              </p>
            </div>
          </div>

          <div className="mt-6 h-64 w-full">
            {startupIndustryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-default-400">
                No startups found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={startupIndustryData}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#71717a"
                    opacity={0.15}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip suffix=" startups" />} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 8, 8, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Funding Stage */}
        <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95 sm:p-8">
          <div className="flex items-center gap-3 border-b border-default-200/60 pb-4 dark:border-default-100/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Startups by Funding Stage
              </h3>
              <p className="text-xs text-default-500">
                Seed, Series A, Bootstrapped stage distribution
              </p>
            </div>
          </div>

          <div className="mt-6 h-64 w-full">
            {fundingStageData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-default-400">
                No funding stage records
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fundingStageData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#71717a"
                    opacity={0.15}
                  />
                  <XAxis
                    dataKey="stage"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={axisTickStyle}
                  />
                  <Tooltip content={<CustomTooltip suffix=" ventures" />} />
                  <Bar
                    dataKey="startups"
                    fill="#f97316"
                    radius={[8, 8, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

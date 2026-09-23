// components/opportunities/OpportunitiesFilterBar.jsx
"use client";

import { useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Button, Input } from "@heroui/react";

export const WORK_TYPE_OPTIONS = [
  { label: "All Work Types", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Onsite", value: "onsite" },
];

export const COMMITMENT_OPTIONS = [
  { label: "All Commitments", value: "all" },
  { label: "Full-Time", value: "full-time" },
  { label: "Part-Time", value: "part-time" },
  { label: "Flexible / Equity", value: "equity" },
];

export default function OpportunitiesFilterBar({
  opportunities = [],
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) {
  // Dynamically extract unique industries from the opportunities dataset
  const uniqueIndustries = useMemo(() => {
    const industries = new Set();
    opportunities.forEach((opp) => {
      const ind = opp.StartupIndustry || opp.industry;
      if (ind) industries.add(ind.trim());
    });
    return Array.from(industries).sort();
  }, [opportunities]);

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.workType !== "all" ||
    filters.commitment !== "all" ||
    filters.industry !== "all" ||
    filters.status !== "all";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-default-200/80 bg-background/90 p-5 shadow-lg backdrop-blur-xl transition-colors dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-6">
      {/* ================= ROW 1: SEARCH BAR & QUICK STATS ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by role title, startup name, tech stack, or industry..."
            startContent={
              <Search size={16} className="text-default-400 shrink-0" />
            }
            endContent={
              filters.search ? (
                <button
                  type="button"
                  onClick={() => onFilterChange("search", "")}
                  className="rounded-full p-1 text-default-400 hover:bg-default-100 hover:text-foreground"
                >
                  <X size={14} />
                </button>
              ) : null
            }
            className="w-full !rounded-2xl"
          />
        </div>

        {/* Results Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/70 bg-default-100/50 px-3 py-2 text-xs font-semibold text-default-600 dark:border-default-100/20 dark:bg-default-100/20 dark:text-default-300">
            <span>
              {totalResults} {totalResults === 1 ? "Role" : "Roles"} Found
            </span>
          </span>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onPress={onResetFilters}
              className="h-9 gap-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* ================= ROW 2: CRITERIA DROPDOWNS & STATUS ================= */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Work Type */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
            Work Type
          </label>
          <select
            value={filters.workType}
            onChange={(e) => onFilterChange("workType", e.target.value)}
            className="h-10 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3 text-xs font-semibold text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
          >
            {WORK_TYPE_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
                className="bg-background text-foreground"
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Commitment Level */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
            Commitment
          </label>
          <select
            value={filters.commitment}
            onChange={(e) => onFilterChange("commitment", e.target.value)}
            className="h-10 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3 text-xs font-semibold text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
          >
            {COMMITMENT_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
                className="bg-background text-foreground"
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Industry Category */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange("industry", e.target.value)}
            className="h-10 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3 text-xs font-semibold text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
          >
            <option value="all" className="bg-background text-foreground">
              All Industries
            </option>
            {uniqueIndustries.map((ind) => (
              <option
                key={ind}
                value={ind}
                className="bg-background text-foreground"
              >
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Listing Status */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="h-10 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3 text-xs font-semibold text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
          >
            <option value="all" className="bg-background text-foreground">
              All Statuses
            </option>
            <option value="Active" className="bg-background text-foreground">
              Active Only
            </option>
            <option value="Closed" className="bg-background text-foreground">
              Closed / Expired
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

// components/opportunities/OpportunitiesExplorer.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  RotateCcw,
  Briefcase,
  Globe,
  Building2,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Avatar, Button, Card, Input, Pagination } from "@heroui/react";

// Work Type Options
export const WORK_TYPE_OPTIONS = [
  { label: "All Work Types", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Onsite", value: "onsite" },
];

export const INDUSTRY_OPTIONS = [
  { label: "All Industries", value: "all" },
  {
    label: "Artificial Intelligence / HR Tech",
    value: "Artificial Intelligence / HR Tech",
  },
  {
    label: "Artificial Intelligence / ML",
    value: "Artificial Intelligence / ML",
  },
  {
    label: "Artificial Intelligence / SaaS",
    value: "Artificial Intelligence / SaaS",
  },
  { label: "Cloud Computing / Database", value: "Cloud Computing / Database" },
  {
    label: "E-commerce / Consumer Electronics",
    value: "E-commerce / Consumer Electronics",
  },
  { label: "E-commerce / Fintech", value: "E-commerce / Fintech" },
  { label: "E-commerce / Logistics", value: "E-commerce / Logistics" },
  { label: "Fintech / Human Resources", value: "Fintech / Human Resources" },
  { label: "Fintech / Payments", value: "Fintech / Payments" },
  { label: "Healthcare / E-commerce", value: "Healthcare / E-commerce" },
  { label: "Human Resources / AI", value: "Human Resources / AI" },
  { label: "Human Resources / SaaS", value: "Human Resources / SaaS" },
  { label: "Transportation / Logistics", value: "Transportation / Logistics" },
  { label: "Travel / Tourism", value: "Travel / Tourism" },
  { label: "Other", value: "Other" },
];

export default function OpportunitiesExplorer({
  initialOpportunities,
  filterQuery,
  total
}) {
  const [search, setSearch] = useState(filterQuery.search || "");
  const [workType, setWorkType] = useState(filterQuery.workType || "all");
  const [industry, setIndustry] = useState(
    filterQuery.StartupIndustry || "all",
  );
  const [page, setPage] = useState(filterQuery.page || 1);

  const router = useRouter();

  const totalItems = total;
  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);
    if (page > 3) {
      pages.push("ellipsis");
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
    return pages;
  };

  const startItem = (page - 1)*itemsPerPage+1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  // 2. URL SearchParams
  useEffect(() => {
    const sp = new URLSearchParams();

    if (search.trim()) {
      sp.set("search", search.trim());
    }

    if (workType !== "all") {
      sp.set("workType", workType);
    }

    if (industry !== "all") {
      sp.set("StartupIndustry", industry);
    }

    if(page){
      sp.set('page', page)
    }

    const queryString = sp.toString();
    router.push(queryString ? `?${queryString}` : "/opportunities", {
      scroll: false,
    });
  }, [search, workType, industry, router, page]);

  // Filters Reset Handler
  const handleReset = () => {
    setSearch("");
    setWorkType("all");
    setIndustry("all");
  };

  const hasActiveFilters =
    Boolean(search.trim()) || workType !== "all" || industry !== "all";

  return (
    <div className="space-y-6">
      {/* ================= FILTER & SEARCH BAR ================= */}
      <div className="flex flex-col gap-4 rounded-3xl border border-default-200/80 bg-background/95 p-5 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90 sm:p-6">
        {/* Top: Search Input + Results Count */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title or required skills..."
              startContent={
                <Search size={16} className="text-default-400 shrink-0" />
              }
              endContent={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="rounded-full p-1 text-default-400 transition-colors hover:bg-default-100 hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                ) : null
              }
              className="w-full !rounded-2xl"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center rounded-xl border border-default-200/70 bg-default-100/50 px-3 py-2 text-xs font-semibold text-default-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300">
              {total}{" "}
              {total === 1
                ? "Opportunity"
                : "Opportunities"}
            </span>

            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                onPress={handleReset}
                className="h-9 gap-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Bottom: Work Type & Industry Dropdowns */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Work Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
              Work Type
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
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

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-default-400">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="h-10 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3 text-xs font-semibold text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
            >
              {INDUSTRY_OPTIONS.map((item) => (
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
        </div>
      </div>

      {/* ================= OPPORTUNITIES GRID ================= */}
      {total > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {initialOpportunities.map((opportunity) => {
              const oppId = opportunity._id?.toString() || opportunity._id;
              const formattedDeadline = opportunity.deadline
                ? new Date(opportunity.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Rolling Basis";

              const isActive =
                opportunity.status?.toLowerCase() === "active" ||
                opportunity.status === "Active";

              return (
                <Card
                  key={oppId}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-default-200/80 bg-background/95 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg dark:border-default-100/20 dark:bg-[#0c0c0e]/90"
                >
                  {/* Header: Startup Info & Status */}
                  <Card.Header className="flex items-start justify-between gap-3 p-0 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-default-200/80 bg-default-100 dark:border-default-100/20 dark:bg-default-100/10">
                        <Avatar.Image
                          src={opportunity.startupLogo}
                          alt={opportunity.startupName}
                          className="object-cover"
                        />
                        <Avatar.Fallback className="text-xs font-bold text-orange-500">
                          {opportunity.startupName?.slice(0, 2).toUpperCase() ||
                            "SF"}
                        </Avatar.Fallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-orange-500">
                          {opportunity.startupName}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-default-400">
                          <Building2 size={11} className="shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {opportunity.StartupIndustry || "General Tech"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isActive && <CheckCircle2 size={10} />}
                      <span>{opportunity.status || "Active"}</span>
                    </span>
                  </Card.Header>

                  {/* Content: Title, Work Type & Skills */}
                  <Card.Content className="flex flex-col gap-3 p-0 py-2">
                    <Link href={`/opportunities/${oppId}`}>
                      <Card.Title className="text-base font-bold text-foreground transition-colors group-hover:text-orange-500">
                        {opportunity.title}
                      </Card.Title>
                    </Link>

                    {/* Work Type Pill */}
                    {opportunity.workType && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-default-200/80 bg-default-100/60 px-2 py-0.5 text-[11px] font-medium capitalize text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300">
                          <Globe size={11} className="text-orange-500" />
                          <span>{opportunity.workType}</span>
                        </span>
                      </div>
                    )}

                    {/* Required Skills */}
                    {opportunity.skills && opportunity.skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {opportunity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-md border border-default-200/60 bg-default-100/40 px-2 py-0.5 text-[11px] font-medium text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card.Content>

                  {/* Footer: Deadline & Minimal Button */}
                  <Card.Footer className="mt-3 flex items-center justify-between border-t border-default-200/60 p-0 pt-3 dark:border-default-100/15">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">
                        Deadline
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <Calendar size={12} className="text-default-400" />
                        <span>{formattedDeadline}</span>
                      </div>
                    </div>

                    <Link href={`/opportunities/${oppId}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 rounded-xl border border-default-200/80 px-3 text-xs font-semibold text-foreground transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500 dark:border-default-100/20"
                      >
                        <span>View Details to apply</span>
                        <ArrowUpRight size={13} />
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>
          <Pagination className="w-full">
            <Pagination.Summary>
              Showing {startItem}-{endItem} of {totalItems} results
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => p - 1)}
                >
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>
              {getPageNumbers().map((p, i) =>
                p === "ellipsis" ? (
                  <Pagination.Item key={`ellipsis-${i}`}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={p}>
                    <Pagination.Link
                      isActive={p === page}
                      onPress={() => setPage(p)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <span>Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/50 p-12 text-center backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Briefcase size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground sm:text-lg">
            No matching opportunities found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-default-500">
            Try adjusting your search terms or clearing your industry and work
            type filters.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onPress={handleReset}
            className="mt-5 flex items-center gap-2 rounded-xl text-xs font-semibold"
          >
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}

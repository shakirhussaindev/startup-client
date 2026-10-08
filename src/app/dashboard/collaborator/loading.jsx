// app/dashboard/admin/loading.jsx
import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ================= 1. HEADER SKELETON ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2.5">
          {/* Badge Skeleton */}
          <div className="h-6 w-32 rounded-full bg-default-200/60 animate-pulse dark:bg-default-100/15" />
          {/* Title Skeleton */}
          <div className="h-8 w-64 rounded-2xl bg-default-200/70 animate-pulse dark:bg-default-100/20 sm:h-9 sm:w-80" />
          {/* Subtitle Skeleton */}
          <div className="h-4 w-72 rounded-lg bg-default-200/50 animate-pulse dark:bg-default-100/10 sm:w-96" />
        </div>

        {/* Live sync pill skeleton */}
        <div className="h-9 w-36 rounded-2xl border border-default-200/60 bg-background/50 animate-pulse dark:border-default-100/10" />
      </div>

      {/* ================= 2. 4 METRIC CARDS SKELETON ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xs backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95"
          >
            {/* Top row: Label & Icon placeholder */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-lg bg-default-200/60 animate-pulse dark:bg-default-100/15" />
              <div className="h-10 w-10 rounded-2xl bg-default-200/60 animate-pulse dark:bg-default-100/15" />
            </div>

            {/* Bottom row: Large stat number & small description */}
            <div className="mt-5 space-y-2.5">
              <div className="h-8 w-32 rounded-xl bg-default-200/80 animate-pulse dark:bg-default-100/25 sm:h-9" />
              <div className="h-3.5 w-40 rounded-lg bg-default-200/40 animate-pulse dark:bg-default-100/10" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= 3. LOWER CONTENT / TABLE SKELETON ================= */}
      <div className="overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 shadow-xs backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/95">
        {/* Table/Section Header Skeleton */}
        <div className="flex items-center justify-between border-b border-default-200/60 p-6 dark:border-default-100/15">
          <div className="space-y-2">
            <div className="h-5 w-44 rounded-xl bg-default-200/70 animate-pulse dark:bg-default-100/20" />
            <div className="h-3.5 w-60 rounded-lg bg-default-200/40 animate-pulse dark:bg-default-100/10" />
          </div>
          <div className="h-4 w-28 rounded-lg bg-default-200/50 animate-pulse dark:bg-default-100/10" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-default-200/50 p-2 dark:divide-default-100/10">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-default-200/60 animate-pulse dark:bg-default-100/15" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded-lg bg-default-200/70 animate-pulse dark:bg-default-100/20" />
                  <div className="h-3 w-44 rounded-lg bg-default-200/40 animate-pulse dark:bg-default-100/10" />
                </div>
              </div>

              <div className="hidden sm:block h-6 w-20 rounded-full bg-default-200/50 animate-pulse dark:bg-default-100/10" />
              <div className="h-4 w-16 rounded-lg bg-default-200/60 animate-pulse dark:bg-default-100/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

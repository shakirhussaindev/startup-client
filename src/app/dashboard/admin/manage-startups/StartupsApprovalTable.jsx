// components/dashboard/admin/StartupsApprovalTable.jsx
"use client";

import { useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { Loader2 } from "lucide-react";
import { updateStartupStatus } from "@/lib/actions/startup";

export default function StartupsApprovalTable({ initialStartups = [] }) {
  const [startups, setStartups] = useState(initialStartups);
  const [loadingId, setLoadingId] = useState(null);

 
  const handleStatusChange = async (startupId, newStatus) => {
    setLoadingId(startupId);

    try {
      await updateStartupStatus(startupId, {status: newStatus});
    
      setStartups((prev) =>
        prev.map((item) =>
          (item._id?.toString() || item._id) === startupId
            ? { ...item, status: newStatus }
            : item,
        ),
      );
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setLoadingId(null);
    }
  };

 
  const renderStatus = (status = "Pending") => {
    const normalized = status.toLowerCase();

    if (normalized === "approved") {
      return (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
          <span>Approved</span>
        </div>
      );
    }

    if (normalized === "rejected") {
      return (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <span className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
          <span>Rejected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <span className="h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
        <span>Pending</span>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-default-200/80 bg-background shadow-sm transition-colors dark:border-default-100/15 dark:bg-[#121214] dark:shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-default-200/80 bg-default-100/60 text-xs font-bold uppercase tracking-wider text-default-500 dark:border-default-100/15 dark:bg-[#161619] dark:text-default-400">
              <th className="px-6 py-4">Startup Name</th>
              <th className="px-6 py-4">Founder Email</th>
              <th className="px-6 py-4">Industry</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Submitted</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-default-200/60 text-foreground dark:divide-default-100/15 dark:text-default-300">
            {startups.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-xs text-default-500"
                >
                  No startup submissions found.
                </td>
              </tr>
            ) : (
              startups.map((startup) => {
                const sId = startup._id?.toString() || startup._id;
                const status = startup.status || "Pending";
                const isPending = status.toLowerCase() === "pending";
                const isApproved = status.toLowerCase() === "approved";
                const isRejected = status.toLowerCase() === "rejected";
                const isLoading = loadingId === sId;

                const submittedDate = startup.createdAt
                  ? new Date(startup.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <tr
                    key={sId}
                    className="transition-colors hover:bg-default-100/50 dark:hover:bg-default-100/[0.04]"
                  >
                    {/* 1. Startup Name + Logo */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 rounded-xl border border-default-200/70 bg-default-100 ring-1 ring-orange-500/20 dark:border-default-100/15 dark:bg-default-100/10">
                          <Avatar.Image
                            src={startup.logo}
                            alt={startup.name}
                            className="object-cover"
                          />
                          <Avatar.Fallback className="text-xs font-bold text-orange-500">
                            {startup.name
                              ? startup.name.slice(0, 2).toUpperCase()
                              : "ST"}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className="font-semibold text-foreground">
                          {startup.name}
                        </span>
                      </div>
                    </td>

                    {/* 2. Founder Email */}
                    <td className="px-6 py-4 text-default-600 dark:text-default-400">
                      {startup.founderEmail || "No Email"}
                    </td>

                    {/* 3. Industry Pill */}
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full border border-default-200/80 bg-default-100 px-3 py-1 text-[11px] font-medium text-default-700 dark:border-default-100/10 dark:bg-[#1c1c20] dark:text-default-400">
                        {startup.industry || "General"}
                      </span>
                    </td>

                    {/* 4. Status */}
                    <td className="px-6 py-4">{renderStatus(status)}</td>

                    {/* 5. Date Submitted */}
                    <td className="px-6 py-4 text-default-600 dark:text-default-400">
                      {submittedDate}
                    </td>

                    {/* 6. Dynamic Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isLoading ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-default-500">
                            <Loader2
                              size={14}
                              className="animate-spin text-orange-500"
                            />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            {/* Approve Button */}
                            {(isPending || isRejected) && (
                              <Button
                                size="sm"
                                onPress={() =>
                                  handleStatusChange(sId, "Approved")
                                }
                                className="h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
                              >
                                Approve
                              </Button>
                            )}

                            {/* Reject Button */}
                            {(isPending || isApproved) && (
                              <Button
                                size="sm"
                                onPress={() =>
                                  handleStatusChange(sId, "Rejected")
                                }
                                className="h-8 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-500/20 dark:border-rose-800/40 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                              >
                                Reject
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

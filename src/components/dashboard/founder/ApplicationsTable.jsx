// components/dashboard/founder/ApplicationsTable.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Globe,
  ExternalLink,
  Briefcase,
  X,
  Loader2,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { updateApplicationStatus } from "@/lib/actions/application";

export default function ApplicationsTable({ initialApplications = [] }) {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState(null); // Details Modal State
  const [loadingId, setLoadingId] = useState(null);

  // Status Change Handler (Accept / Reject)
  const handleStatusChange = async (appId, newStatus) => {
    setLoadingId(appId);
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.success) {
        
        router.refresh();
        if (selectedApp) {
          setSelectedApp(null);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (rawStatus = "Pending") => {
    let statusText = "Pending";

    if (typeof rawStatus === "string") {
      statusText = rawStatus;
    } else if (rawStatus && typeof rawStatus === "object") {
      statusText = rawStatus.status || "Pending";
    }

    const s = String(statusText).toLowerCase();

    if (s === "accepted") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={12} />
          <span>Accepted</span>
        </span>
      );
    }

    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <XCircle size={12} />
          <span>Rejected</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <Clock size={12} />
        <span>Pending</span>
      </span>
    );
  };

  if (initialApplications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/50 p-12 text-center backdrop-blur-xl dark:border-default-100/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
          <Briefcase size={28} />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground sm:text-lg">
          No Applications Received Yet
        </h3>
        <p className="mt-1 max-w-sm text-xs text-default-500">
          When talent applies to your opportunities, their candidate cards will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-3xl border border-default-200/80 bg-background/95 shadow-sm backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-default-200/80 bg-default-100/40 text-[11px] font-bold uppercase tracking-wider text-default-500 dark:border-default-100/15 dark:bg-default-100/10">
            <tr>
              <th scope="col" className="px-5 py-4">
                Applicant
              </th>
              <th scope="col" className="px-5 py-4">
                Opportunity Title
              </th>
              <th scope="col" className="px-5 py-4">
                Applied Date
              </th>
              <th scope="col" className="px-5 py-4">
                Status
              </th>
              <th scope="col" className="px-5 py-4 text-center">
                Details
              </th>
              <th scope="col" className="px-5 py-4 text-right">
                Decision
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-default-200/60 dark:divide-default-100/10">
            {initialApplications.map((app) => {
              const appId = app._id?.toString() || app._id;
              const isUpdating = loadingId === appId;
              const formattedDate =
                app.appliedAt || app.createdAt
                  ? new Date(app.appliedAt || app.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "N/A";

              return (
                <tr
                  key={appId}
                  className="transition-colors hover:bg-default-100/30 dark:hover:bg-default-100/5"
                >
                  {/* 1. Applicant Name & Img */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-default-200/80 bg-default-100 ring-2 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10">
                        <Avatar.Image
                          src={app.applicantImg}
                          alt={app.applicantName}
                          className="object-cover"
                        />
                        <Avatar.Fallback className="text-xs font-bold text-orange-500">
                          {app.applicantName
                            ? app.applicantName.slice(0, 2).toUpperCase()
                            : "AP"}
                        </Avatar.Fallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">
                          {app.applicantName}
                        </span>
                        <span className="text-[11px] text-default-400">
                          {app.applicantEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Opportunity Title */}
                  <td className="px-5 py-4 font-semibold text-foreground">
                    <span
                      className="line-clamp-1 max-w-[200px]"
                      title={app.opportunityTitle}
                    >
                      {app.opportunityTitle}
                    </span>
                  </td>

                  {/* 3. Applied Date */}
                  <td className="px-5 py-4 text-default-500 whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* 4. Status Badge */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {renderStatusBadge(app.status)}
                  </td>

                  {/* 5. See Details Button */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => setSelectedApp(app)}
                      className="h-8 gap-1.5 rounded-xl border border-default-200/80 px-3 text-xs font-semibold text-foreground transition-colors hover:border-orange-500/40 hover:text-orange-500 dark:border-default-100/20"
                    >
                      <Eye size={13} className="text-orange-500" />
                      <span>See Details</span>
                    </Button>
                  </td>

                  {/* 6. Accept / Reject Buttons */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {isUpdating ? (
                      <div className="inline-flex items-center gap-1.5 text-xs text-default-400">
                        <Loader2
                          size={14}
                          className="animate-spin text-orange-500"
                        />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* Reject Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          isDisabled={app.status === "Rejected"}
                          onPress={() => handleStatusChange(appId, "Rejected")}
                          className={`h-8 rounded-xl px-2.5 text-xs font-semibold transition-all ${
                            app.status === "Rejected"
                              ? "opacity-40 cursor-not-allowed"
                              : "border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </Button>

                        {/* Accept Button */}
                        <Button
                          size="sm"
                          isDisabled={app.status === "Accepted"}
                          onPress={() => handleStatusChange(appId, "Accepted")}
                          className={`h-8 rounded-xl px-3 text-xs font-semibold text-white shadow-sm transition-all ${
                            app.status === "Accepted"
                              ? "bg-emerald-600 opacity-40 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          <span>Accept</span>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= SEE DETAILS MODAL ================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedApp(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-default-200/80 bg-background p-6 shadow-2xl backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e] sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-default-200/60 pb-4 dark:border-default-100/15">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-orange-500/30">
                  <Avatar.Image
                    src={selectedApp.applicantImg}
                    alt={selectedApp.applicantName}
                  />
                  <Avatar.Fallback className="font-bold text-orange-500">
                    {selectedApp.applicantName?.slice(0, 2).toUpperCase() ||
                      "AP"}
                  </Avatar.Fallback>
                </Avatar>
                <div>
                  <h3 className="text-base font-bold text-foreground sm:text-lg">
                    {selectedApp.applicantName}
                  </h3>
                  <p className="text-xs text-default-400">
                    {selectedApp.applicantEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-full p-2 text-default-400 hover:bg-default-100 hover:text-foreground dark:hover:bg-default-100/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-4 text-xs">
              {/* Role Title & Status */}
              <div className="flex items-center justify-between rounded-2xl border border-default-200/60 bg-default-100/40 p-3.5 dark:border-default-100/10 dark:bg-default-100/5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                    Applied Role
                  </span>
                  <p className="font-bold text-foreground text-sm">
                    {selectedApp.opportunityTitle}
                  </p>
                </div>
                <div>{renderStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Availability */}
              {selectedApp.availability && (
                <div className="flex items-center justify-between">
                  <span className="text-default-400">
                    Candidate Availability:
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedApp.availability}
                  </span>
                </div>
              )}

              {/* Pitch Note */}
              <div className="space-y-1 rounded-2xl border border-default-200/60 bg-default-100/40 p-4 dark:border-default-100/10 dark:bg-default-100/5">
                <span className="font-bold text-foreground">
                  Pitch / Cover Note:
                </span>
                <p className="leading-relaxed text-default-600 dark:text-default-300">
                  {selectedApp.pitchNote || "No pitch note provided."}
                </p>
              </div>

              {/* Attached Links (Resume & Portfolio Only) */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                  Links & Attachments
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {/* Resume */}
                  {selectedApp.resumeLink && (
                    <a
                      href={selectedApp.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-default-200/80 bg-default-100/50 p-2.5 font-semibold text-default-700 transition-colors hover:border-orange-500/40 hover:text-orange-500 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} className="text-orange-500" />
                        <span>Resume</span>
                      </div>
                      <ExternalLink size={12} className="text-default-400" />
                    </a>
                  )}

                  {/* Portfolio */}
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-default-200/80 bg-default-100/50 p-2.5 font-semibold text-default-700 transition-colors hover:border-emerald-500/40 hover:text-emerald-500 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <Globe size={14} className="text-emerald-500" />
                        <span>Portfolio</span>
                      </div>
                      <ExternalLink size={12} className="text-default-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-default-200/60 pt-4 dark:border-default-100/15">
              <Button
                size="sm"
                variant="secondary"
                isDisabled={selectedApp.status === "Rejected"}
                onPress={() =>
                  handleStatusChange(
                    selectedApp._id?.toString() || selectedApp._id,
                    "Rejected",
                  )
                }
                className="h-9 rounded-xl border border-rose-500/30 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              >
                <XCircle size={14} />
                <span>Reject</span>
              </Button>

              <Button
                size="sm"
                isDisabled={selectedApp.status === "Accepted"}
                onPress={() =>
                  handleStatusChange(
                    selectedApp._id?.toString() || selectedApp._id,
                    "Accepted",
                  )
                }
                className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
              >
                <CheckCircle2 size={14} />
                <span>Accept</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

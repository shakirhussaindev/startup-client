// components/opportunities/OpportunityCard.jsx
"use client";

import Link from "next/link";
import {
  Globe,
  Clock,
  Calendar,
  ArrowUpRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Card, Button, Avatar } from "@heroui/react";

export default function OpportunityCard({ opportunity }) {
 
  const data = opportunity 

  const formattedDeadline = new Date(data.deadline).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const isActive = data.status === "Active" || data.status === "active";

  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-default-200/80 bg-background/95 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 dark:border-default-100/20 dark:bg-[#0c0c0e]/90">
      {/* Glow highlight on hover */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* ================= HEADER: BRANDING & STATUS ================= */}
      <Card.Header className="flex items-start justify-between gap-3 p-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-default-200/80 dark:ring-default-800">
            <Avatar.Image
              src={data.startupLogo}
              alt={data.startupName}
              className="object-cover"
            />
            <Avatar.Fallback className="text-xs font-bold text-orange-500">
              {data.startupName?.slice(0, 2).toUpperCase() || "SF"}
            </Avatar.Fallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
              {data.startupName}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-default-400">
              <Building2 size={12} className="shrink-0" />
              <span className="truncate max-w-[170px]">
                {data.StartupIndustry}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}
        >
          {isActive && <CheckCircle2 size={11} />}
          {data.status}
        </span>
      </Card.Header>

      {/* ================= BODY: TITLE, WORK METAS & SKILLS ================= */}
      <Card.Content className="flex flex-col gap-3 p-0 py-2">
        {/* Role Title */}
        <Link href={`/opportunities/${data._id}`} className="group/title">
          <Card.Title className="text-base font-bold text-foreground transition-colors group-hover/title:text-orange-500 sm:text-lg">
            {data.title}
          </Card.Title>
        </Link>

        {/* Work Meta Attributes */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
          <span className="inline-flex items-center gap-1 rounded-lg bg-default-100/70 px-2 py-1 font-medium capitalize text-default-600 dark:bg-default-100/20 dark:text-default-300">
            <Globe size={13} className="text-orange-500" />
            {data.workType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-default-100/70 px-2 py-1 font-medium capitalize text-default-600 dark:bg-default-100/20 dark:text-default-300">
            <Clock size={13} className="text-orange-500" />
            {data.commitment}
          </span>
        </div>

        {/* Required Skills Chips */}
        {data.skills?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-md border border-default-200/60 bg-default-100/40 px-2 py-0.5 text-[11px] font-medium text-default-600 transition-colors hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-400 dark:hover:text-orange-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </Card.Content>

      {/* ================= FOOTER: DEADLINE & APPLY ACTION ================= */}
      <Card.Footer className="mt-3 flex items-center justify-between border-t border-default-200/60 p-0 pt-3.5 dark:border-default-100/15">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-default-400">
            Deadline
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Calendar size={12} className="text-default-400" />
            <span>{formattedDeadline}</span>
          </div>
        </div>

        <Link href={`/opportunities/${data._id}`}>
          <Button
            size="sm"
            className="group/btn flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-orange-500/35"
          >
            <span>Apply Now</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
}

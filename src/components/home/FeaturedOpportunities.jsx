// components/home/FeaturedOpportunities.jsx
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Building2,
  Clock,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { getFeaturedOpportunities } from "@/lib/api/opportunities";

export default async function FeaturedOpportunities() {
  const opportunities = (await getFeaturedOpportunities()) || [];

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16 sm:py-24">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent blur-3xl dark:from-orange-500/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>Active Roles & Co-founder Openings</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Featured Opportunities
            </h2>
            <p className="max-w-xl text-xs text-default-500 sm:text-sm">
              Discover open positions, technical partner roles, and collaborate
              with high-growth startup founders.
            </p>
          </div>

          <Link href="/opportunities">
            <Button
              variant="secondary"
              className="group h-10 rounded-xl border border-default-200/80 px-4 text-xs font-semibold text-foreground hover:border-orange-500/40 hover:bg-default-100 dark:border-default-100/15"
            >
              <span>Explore All Roles</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>

        {/* ================= OPPORTUNITIES GRID ================= */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((item) => {
            const oppId = item._id?.toString() || item._id;

            // Format deadline nicely
            const formattedDeadline = item.deadline
              ? new Date(item.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Rolling Basis";

            return (
              <div
                key={oppId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90"
              >
                {/* Subtle Card Glow on Hover */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="space-y-4">
                  {/* Top: Startup Info & Work Type Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Startup Logo */}
                      <Avatar className="h-11 w-11 shrink-0 rounded-2xl border border-default-200/80 bg-default-100 ring-2 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10">
                        <Avatar.Image
                          src={item.startupLogo}
                          alt={item.startupName || "Startup"}
                          className="object-cover"
                        />
                        <Avatar.Fallback className="text-xs font-bold text-orange-500">
                          {item.startupName
                            ? item.startupName.slice(0, 2).toUpperCase()
                            : "SF"}
                        </Avatar.Fallback>
                      </Avatar>

                      {/* 1. Startup Name */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-default-500">
                          {item.startupName || "Venture"}
                        </span>
                        {item.StartupIndustry && (
                          <span className="text-[11px] text-default-400">
                            {item.StartupIndustry}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Commitment / Work Type Tag */}
                    {item.workType && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-default-200/80 bg-default-100/70 px-2.5 py-0.5 text-[10px] font-semibold capitalize text-default-600 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300">
                        {item.workType === "remote" ? (
                          <Globe size={11} className="text-orange-500" />
                        ) : (
                          <Building2 size={11} className="text-orange-500" />
                        )}
                        <span>{item.workType}</span>
                      </span>
                    )}
                  </div>

                  {/* 2. Role Title */}
                  <div>
                    <Link href={`/opportunities/${oppId}`}>
                      <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-orange-500 sm:text-lg">
                        {item.title}
                      </h3>
                    </Link>
                  </div>

                  {/* 3. Required Skills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                      Required Skills
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.skills && item.skills.length > 0 ? (
                        <>
                          {item.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-default-200/80 bg-default-100/60 px-2.5 py-1 text-[11px] font-medium text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 3 && (
                            <span className="inline-flex items-center px-1.5 text-[11px] font-semibold text-default-400">
                              +{item.skills.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-default-400">
                          Open to all backgrounds
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Bottom Row: Application Deadline & CTA */}
                <div className="mt-6 flex items-center justify-between border-t border-default-200/60 pt-4 dark:border-default-100/15">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                      Deadline
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Calendar size={13} className="text-orange-500" />
                      <span>{formattedDeadline}</span>
                    </div>
                  </div>

                  {/* View Role Action */}
                  <Link href={`/opportunities/${oppId}`}>
                    <Button
                      size="sm"
                      className="flex h-8 items-center gap-1 rounded-xl bg-orange-500/10 px-3 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white"
                    >
                      <span>View Role</span>
                      <ArrowUpRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

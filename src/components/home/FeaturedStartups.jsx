// components/home/FeaturedStartups.jsx
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  User,
  Users,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { getFeaturedStartups } from "@/lib/api/startup";

export default async function FeaturedStartups() {
  const startups = (await getFeaturedStartups()) || [];

  if (startups.length === 0) return null;

  return (
    <section className="relative w-full py-16 sm:py-24">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent blur-3xl dark:from-orange-500/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>Verified Ecosystem</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Featured Startups
            </h2>
            <p className="max-w-xl text-xs text-default-500 sm:text-sm">
              Discover vetted ventures and teams actively building disruptive
              solutions across the network.
            </p>
          </div>

          <Link href="/startups">
            <Button
              variant="secondary"
              className="group h-10 rounded-xl border border-default-200/80 px-4 text-xs font-semibold hover:border-orange-500/40 dark:border-default-100/15"
            >
              <span>Explore All Startups</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>

        {/* 6 Grid Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => {
            const startupId = startup._id?.toString() || startup._id;

            // Founder name fallback
            const founderDisplayName =
              startup.founderName ||
              (startup.founderEmail
                ? startup.founderEmail.split("@")[0]
                : "Verified Founder");

            // Team size needed fallback
            const teamSize =
              startup.teamSizeNeeded || startup.teamSize || "2–4 Core Builders";

            return (
              <div
                key={startupId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90"
              >
                {/* Subtle Hover Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="space-y-4">
                  {/* Top Row: Logo + Startup Name + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-12 w-12 shrink-0 rounded-2xl border border-default-200/80 bg-default-100 ring-2 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10">
                        <Avatar.Image
                          src={startup.logo}
                          alt={startup.name}
                          className="object-cover"
                        />
                        <Avatar.Fallback className="text-xs font-bold text-orange-500">
                          {startup.name
                            ? startup.name.slice(0, 2).toUpperCase()
                            : "SF"}
                        </Avatar.Fallback>
                      </Avatar>

                      <div>
                        {/* 1. Startup Name */}
                        <h3 className="font-bold text-foreground transition-colors group-hover:text-orange-500 sm:text-base">
                          {startup.name}
                        </h3>
                        {/* 2. Founder Name */}
                        <div className="flex items-center gap-1.5 text-xs text-default-500">
                          <User size={12} className="text-default-400" />
                          <span className="capitalize">
                            {founderDisplayName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={11} />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* 3. Industry & Funding Stage Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/70 bg-default-100/50 px-2.5 py-1 text-[11px] font-medium text-default-600 dark:border-default-100/15 dark:bg-default-100/10 dark:text-default-300">
                      <Layers size={12} className="text-orange-500" />
                      <span>{startup.industry || "Technology"}</span>
                    </span>

                    {startup.fundingStage && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-default-200/70 bg-default-100/50 px-2.5 py-1 text-[11px] font-semibold text-foreground dark:border-default-100/15 dark:bg-default-100/10">
                        <TrendingUp size={12} className="text-orange-500" />
                        <span>{startup.fundingStage}</span>
                      </span>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="line-clamp-2 text-xs leading-relaxed text-default-500">
                    {startup.description ||
                      "Building scalable digital infrastructure and high-impact products."}
                  </p>
                </div>

                {/* Bottom Row: Team Size Needed + Details Action */}
                <div className="mt-6 flex items-center justify-between border-t border-default-200/60 pt-4 dark:border-default-100/15">
                  {/* 4. Team Size Needed */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                      Team Needed
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Users size={13} className="text-orange-500" />
                      <span>{teamSize}</span>
                    </div>
                  </div>

                  {/* Details Link Button */}
                  <Link href={`/startups/${startupId}`}>
                    <Button
                      size="sm"
                      className="flex h-8 items-center gap-1 rounded-xl bg-orange-500/10 px-3 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white"
                    >
                      <span>Details</span>
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

// components/StartupStats.jsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "$42M+",
    label: "Capital Raised",
    subtext: "Secured by teams formed on StartupForge",
  },
  {
    icon: Users,
    value: "1,800+",
    label: "Active Founders",
    subtext: "Technical, product, and growth operators",
  },
  {
    icon: TrendingUp,
    value: "340+",
    label: "Teams Formed",
    subtext: "Actively building live MVPs",
  },
  {
    icon: CheckCircle2,
    value: "89%",
    label: "Launch Rate",
    subtext: "Ship a working product within 90 days",
  },
];

export default function StartupStats() {
  return (
    <section className="relative py-16 sm:py-24 border-y border-default-200/50 bg-default-50/50 dark:border-default-100/20 dark:bg-zinc-950/40">
      {/* Background radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="h-64 w-full max-w-4xl rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center rounded-2xl border border-default-200/60 bg-background/80 p-6 text-center backdrop-blur-md dark:border-default-100/30 sm:items-start sm:text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-4">
                  <Icon size={20} />
                </div>

                <div className="text-3xl font-black tracking-tight text-foreground sm:text-4xl bg-gradient-to-br from-foreground via-foreground to-default-500 bg-clip-text">
                  {item.value}
                </div>

                <div className="mt-1 text-sm font-semibold text-foreground">
                  {item.label}
                </div>

                <p className="mt-1 text-xs text-default-500">{item.subtext}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

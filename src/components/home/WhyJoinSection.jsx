// components/WhyJoinSection.jsx
"use client";

import { motion } from "framer-motion";
import {
  Users2,
  Target,
  ShieldCheck,
  Rocket,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Users2,
    title: "Vetted Co-Founder Matching",
    description:
      "Skip cold LinkedIn DMs. Connect with technical builders and domain experts evaluated on verified portfolio work and shared vision.",
    tag: "Networking",
  },
  {
    icon: Target,
    title: "Role-Based Opportunities",
    description:
      "Filter openings by equity share, funding stage, tech stack, and timezone alignment to find the exact project needing your skillset.",
    tag: "Discovery",
  },
  {
    icon: Rocket,
    title: "Fast-Track MVP Launch",
    description:
      "Access pre-negotiated cloud credits, boilerplates, and team workspaces designed to take you from concept to live deployment in weeks.",
    tag: "Execution",
  },
  {
    icon: ShieldCheck,
    title: "Standardized Legal Agreements",
    description:
      "Protect your equity from day one with automated founder vesting schedules, IP transfer forms, and battle-tested advisor agreements.",
    tag: "Security",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhyJoinSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-4">
            <Zap size={14} />
            <span>Built For Builders</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to turn ideas into companies
          </h2>
          <p className="mt-4 text-base text-default-600 dark:text-default-400">
            StartupForge eliminates the operational friction of finding trusted
            collaborators, so you can focus on writing code and talking to
            users.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative flex flex-col justify-between rounded-2xl border border-default-200/60 bg-background/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 dark:border-default-100/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-default-400">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-default-600 dark:text-default-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  
                  <span>Learn more</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

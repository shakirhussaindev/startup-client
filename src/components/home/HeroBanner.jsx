"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

// Smooth slide-up variant for elements
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for a smooth deceleration
    },
  },
};

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28">
      {/* ================= AMBIENT BACKGROUND GLOW ================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[340px] w-[580px] rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-rose-500/10 blur-[120px] dark:from-orange-500/15 dark:via-amber-500/10 dark:to-transparent" />
      </div>

      {/* Subtle Background Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] dark:opacity-40"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* ================= 1. INTRO BADGE ================= */}
          <motion.div variants={itemVariants}>
            <Link
              href="/startups"
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30"
            >
              <span>StartupForge is live</span>
              <ChevronRight size={13} className="opacity-60" />
            </Link>
          </motion.div>

          {/* ================= 2. TITLE ================= */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Where Visionary Ideas{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                Forge Real Teams
              </span>
            </span>
          </motion.h1>

          {/* ================= 3. DESCRIPTION ================= */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base leading-relaxed text-default-600 sm:text-lg dark:text-default-400"
          >
            Connect with technical co-founders, early-stage builders, and
            capital. Transform ambitious concepts into production-ready startups
            faster than ever.
          </motion.p>

          {/* ================= 4. CTA BUTTONS ================= */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-3.5"
          >
            <Button
              as={Link}
              href="/login"
              className="group relative h-12 w-full sm:w-auto px-7 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/35"
            >
              <span>Get Started Free</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>
            <Link href="/startups">
              <Button
                variant="secondary"
                className="h-12 w-full sm:w-auto px-6 rounded-xl font-medium border border-default-200 bg-background/60 backdrop-blur-md hover:bg-default-100 transition-colors"
              >
                Explore Startups
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

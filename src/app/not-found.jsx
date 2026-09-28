// app/not-found.jsx
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Compass, Search } from "lucide-react";
import { Button } from "@heroui/react";

export const metadata = {
  title: "404 - Page Not Found | StartupForge",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-rose-500/15 blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-12">
        {/* Icon Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 ring-8 ring-orange-500/5 dark:bg-orange-500/15">
          <FileQuestion size={40} strokeWidth={2.2} />
        </div>

        {/* Status Pill */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
          <Search size={12} />
          <span>404 • Page Not Found</span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Lost in the Ecosystem?
        </h1>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-default-500 sm:text-sm">
          The link you followed might be broken, or the page may have been
          removed, renamed, or is temporarily unavailable.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] sm:w-auto sm:px-6">
              <Home size={15} />
              <span>Return Home</span>
            </Button>
          </Link>

          <Link href="/opportunities" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              className="h-11 w-full rounded-xl font-semibold sm:w-auto sm:px-5"
            >
              <Compass size={15} />
              <span>Browse Opportunities</span>
            </Button>
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-8 border-t border-default-200/60 pt-5 dark:border-default-100/20">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-default-400 transition-colors hover:text-foreground"
          >
            <ArrowLeft size={13} />
            <span>Go back to your dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

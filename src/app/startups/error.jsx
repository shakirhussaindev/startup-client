"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw, Rocket } from "lucide-react";

export default function StartupError({ error, reset }) {
  useEffect(() => {
    console.error("Startup route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[85vh] w-full items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Visual Badge / Icon */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl" />
          <AlertTriangle className="relative h-8 w-8 text-amber-400" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
          Startup Profile Unavailable
        </span>

        {/* Heading & Context */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Unable to load startup
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          We couldn't retrieve the details for this startup. The profile may
          have been removed, the link may be malformed, or the database
          connection timed out.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/startups"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/60 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
          >
            <Rocket className="h-4 w-4" />
            Explore Startups
          </Link>
        </div>

        {/* Debugging Digest for Vercel logs */}
        {error?.digest ? (
          <div className="mt-8 border-t border-zinc-800/80 pt-4 text-left">
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Incident Digest:</span>
              <code className="font-mono text-zinc-400">{error.digest}</code>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

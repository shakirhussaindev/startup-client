// app/not-found.jsx
import Link from "next/link";
import { Home, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@heroui/react";

export const metadata = {
  title: "404 Not Found - StartupForge",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] w-full flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      {/* Background Subtle Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-rose-500/10 blur-3xl" />

      {/* Main Content Area */}
      <div className="relative z-10 flex max-w-lg flex-col items-center">
        {/* Balanced 404 Accent */}
        <span className="text-7xl font-black tracking-tight text-orange-500 sm:text-8xl">
          404
        </span>

        {/* Clear Primary Heading */}
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          404 Not Found Page
        </h1>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-default-500 sm:text-sm">
          Oops! The page you are looking for doesn&apos;t exist, has been
          removed, renamed, or is temporarily unavailable in the ecosystem.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] sm:w-auto">
              <Home size={15} />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link href="/opportunities" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              className="h-11 w-full rounded-xl border border-default-200/80 px-6 font-semibold transition-colors hover:border-orange-500/40 hover:bg-default-100 dark:border-default-100/20 sm:w-auto"
            >
              <Compass size={15} />
              <span>Browse Opportunities</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

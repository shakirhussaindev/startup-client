// app/loading.jsx
import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-rose-500/10 blur-3xl" />

      {/* Center Animated Loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings & Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer Pulsing Glow */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl bg-orange-500/20 opacity-75 duration-1000" />

          {/* Rotating Gradient Spinner Border */}
          <div className="absolute inset-0 animate-spin rounded-3xl border-2 border-transparent border-t-orange-500 border-r-amber-500 [animation-duration:1.2s]" />

          {/* Core Brand Icon Box */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-default-200/80 bg-background/90 text-orange-500 shadow-xl backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90">
            <Rocket size={26} className="animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="mt-6 flex flex-col items-center space-y-1.5 text-center">
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            Loading Ecosystem
          </span>
          <p className="text-xs text-default-400">
            Fetching verified startup & opportunity records...
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-default-200/60 dark:bg-default-100/10">
          <div className="h-full w-full -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// app/opportunities/loading.jsx
export default function OpportunitiesLoading() {
  return (
    <div className="mx-auto max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-2xl bg-default-200/60 dark:bg-default-100/10" />
        <div className="h-4 w-96 animate-pulse rounded-xl bg-default-200/40 dark:bg-default-100/5" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-28 w-full animate-pulse rounded-3xl border border-default-200/60 bg-default-100/30 dark:border-default-100/10 dark:bg-default-100/5" />

      {/* 6 Grid Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-72 flex-col justify-between rounded-2xl border border-default-200/70 bg-background/80 p-5 shadow-xs dark:border-default-100/10 dark:bg-[#0c0c0e]/80"
          >
            {/* Top row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-default-200 dark:bg-default-100/10" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 animate-pulse rounded-md bg-default-200 dark:bg-default-100/10" />
                    <div className="h-2.5 w-16 animate-pulse rounded-md bg-default-200/60 dark:bg-default-100/5" />
                  </div>
                </div>
                <div className="h-5 w-14 animate-pulse rounded-full bg-default-200/70 dark:bg-default-100/10" />
              </div>

              {/* Title & tags */}
              <div className="h-5 w-3/4 animate-pulse rounded-lg bg-default-200 dark:bg-default-100/10" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-md bg-default-200/60 dark:bg-default-100/10" />
                <div className="h-6 w-16 animate-pulse rounded-md bg-default-200/60 dark:bg-default-100/10" />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between border-t border-default-200/60 pt-3 dark:border-default-100/10">
              <div className="h-4 w-20 animate-pulse rounded-md bg-default-200/60 dark:bg-default-100/10" />
              <div className="h-8 w-24 animate-pulse rounded-xl bg-default-200 dark:bg-default-100/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

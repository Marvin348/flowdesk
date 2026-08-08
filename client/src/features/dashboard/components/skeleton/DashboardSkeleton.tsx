const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-md bg-muted ${className}`} />
);

const SkeletonCardHeader = () => (
  <div className="mb-5 flex items-start justify-between gap-4">
    <div>
      <SkeletonBlock className="h-3 w-16" />
      <SkeletonBlock className="mt-2 h-6 w-40" />
    </div>
    <SkeletonBlock className="size-10" />
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <section className="mb-6 border-b border-border/80 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <SkeletonBlock className="size-10 shrink-0" />

            <div className="min-w-0 flex-1">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="mt-2 h-7 w-48" />
              <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
              <SkeletonBlock className="mt-2 h-4 w-2/3 max-w-md" />
            </div>
          </div>

          <SkeletonBlock className="h-10 w-36" />
        </div>
      </section>

      <section className="mb-6 rounded-md border bg-card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-md border bg-background p-4">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-4 h-8 w-16" />
              <SkeletonBlock className="mt-3 h-3 w-28" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="h-full rounded-md border bg-card p-4">
          <SkeletonCardHeader />

          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <div
                key={sectionIndex}
                className="mb-20 rounded-md border bg-background p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-5 w-8" />
                </div>

                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
                    >
                      <div>
                        <SkeletonBlock className="h-4 w-3/4" />
                        <SkeletonBlock className="mt-2 h-3 w-1/2" />
                      </div>
                      <SkeletonBlock className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-full flex-col gap-6">
          <div className="rounded-md border bg-card p-4">
            <SkeletonCardHeader />

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 flex items-center justify-between">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-10" />
                  </div>
                  <SkeletonBlock className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <SkeletonCardHeader />

            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-md border bg-background p-3"
                >
                  <div>
                    <SkeletonBlock className="h-3 w-28" />
                    <SkeletonBlock className="mt-2 h-4 w-3/4" />
                    <SkeletonBlock className="mt-3 h-3 w-1/2" />
                  </div>
                  <SkeletonBlock className="h-5 w-14" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DashboardSkeleton;

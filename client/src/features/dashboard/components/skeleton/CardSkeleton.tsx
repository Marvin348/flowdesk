export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`border rounded-md p-4 animate-pulse ${className} min-h-[250px]`}
  >
    <div className="h-5 w-32 rounded bg-muted mb-4" />
    <div className="space-y-3">
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-5/6 rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
    </div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="border rounded-md p-4 animate-pulse">
        <div className="h-4 w-16 rounded bg-muted mb-2" />
        <div className="h-6 w-10 rounded bg-muted" />
      </div>
    ))}
  </div>
);

export const PieChartSkeleton = () => (
  <div className="border rounded-md p-4 animate-pulse h-full flex flex-col">
    <div className="h-5 w-32 rounded bg-muted mb-6" />

    <div className="flex-1 flex items-center justify-center">
      <div className="relative size-32">
        <div className="absolute inset-0 rounded-full bg-muted" />

        <div className="absolute inset-6 rounded-full bg-background" />
      </div>
    </div>

    <div className="mt-4 space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  </div>
);

export const UpcomingTasksSkeleton = () => (
  <div className="border rounded-md p-4 animate-pulse min-h-[250px]">
    <div className="h-5 w-40 rounded bg-muted mb-4" />

    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      ))}
    </div>
  </div>
);

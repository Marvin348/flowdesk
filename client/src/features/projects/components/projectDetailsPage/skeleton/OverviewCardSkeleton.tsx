export const OverviewCardSkeleton = ({
  className = "",
}: {
  className?: string;
}) => (
  <div
    className={`h-full flex flex-col border rounded-md overflow-hidden animate-pulse ${className}`}
  >
    <div className="p-4 pb-2 flex items-center justify-between">
      <div className="h-5 w-32 rounded bg-muted" />
      <div className="h-4 w-10 rounded bg-muted" />
    </div>

    <div className="flex-1 min-h-0 px-4 pb-4 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="size-8 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SmallOverviewCardSkeleton = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div className={`h-full border rounded-md p-4 animate-pulse ${className}`}>
      <div className="h-5 w-28 rounded bg-muted mb-6" />
      <div className="h-3 w-full rounded-full bg-muted" />
    </div>
  );
};

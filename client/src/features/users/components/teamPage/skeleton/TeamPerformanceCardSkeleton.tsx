const TeamPerformanceCardSkeleton = () => {
  return (
    <div className="border p-4 rounded-md animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full bg-muted" />

        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-12 rounded bg-muted" />
        <div className="h-6 w-24 rounded-full bg-muted" />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg bg-muted/40 p-3 space-y-2">
            <div className="h-3 w-14 rounded bg-muted" />
            <div className="h-5 w-8 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-4 w-10 rounded bg-muted" />
        </div>

        <div className="h-2 w-full rounded-full bg-muted" />
      </div>

      <div className="flex justify-end mt-4">
        <div className="h-4 w-16 rounded bg-muted" />
      </div>
    </div>
  );
};

export default TeamPerformanceCardSkeleton;

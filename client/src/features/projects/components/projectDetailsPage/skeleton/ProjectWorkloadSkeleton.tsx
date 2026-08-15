const ProjectWorkloadSkeleton = () => {
  return (
    <section className="h-full border rounded-md overflow-hidden animate-pulse">
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] bg-muted p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-20 rounded bg-background/60" />
        ))}
      </div>

      <div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i}>

            <div className="sm:hidden border-b last:border-none p-3">
              <div className="flex items-center gap-3">
                <div className="size-8 shrink-0 rounded-full bg-muted" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="h-7 w-20 rounded-md bg-muted" />
                <div className="h-7 w-24 rounded-md bg-muted" />
                <div className="h-7 w-28 rounded-full bg-muted" />
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-2 border-b">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 shrink-0 rounded-full bg-muted" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
              </div>

              <div className="h-4 w-8 rounded bg-muted" />
              <div className="h-4 w-8 rounded bg-muted" />

              <div className="h-6 w-24 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ProjectWorkloadSkeleton;

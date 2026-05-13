const ProjectCollaboratorSkeleton = () => {
  return (
    <div className="h-full border rounded-md mt-2 overflow-hidden animate-pulse">
      <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 p-2 bg-muted">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-24 rounded bg-background/60" />
        ))}
      </div>

      <div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="p-2 grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 border-b last:border-none"
          >
            <div className="flex items-center gap-4 w-fit min-w-0">
              <div className="size-4 shrink-0 rounded bg-muted" />

              <div className="min-w-0 flex items-center gap-4">
                <div className="size-8 shrink-0 rounded-full bg-muted" />

                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
            </div>

            <div className="min-w-0 hidden sm:flex">
              <div className="min-w-0 w-full space-y-2">
                <div className="h-4 w-40 max-w-full rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            </div>

            <div className="min-w-0 hidden md:flex items-center">
              <div className="flex items-center gap-2">
                <div className="size-4 shrink-0 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
            </div>

            <div className="justify-self-end">
              <div className="size-6 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectCollaboratorSkeleton;

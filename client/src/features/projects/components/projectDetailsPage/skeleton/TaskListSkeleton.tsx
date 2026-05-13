const TaskListSkeleton = () => {
  return (
    <section className="animate-pulse">
      <div className="grid grid-cols-4 gap-2 p-2 bg-muted rounded-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-16 rounded bg-background/60" />
        ))}
      </div>

      <div className="mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-b py-4">
            <div className="w-full flex items-center gap-4">
              <div className="size-7 shrink-0 rounded-full border bg-muted" />

              <div className="h-5 w-28 rounded bg-muted" />

              <div className="h-4 w-6 rounded bg-muted" />
            </div>

            {i === 0 && (
              <div className="mt-2 p-4 rounded-md bg-muted space-y-3">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center gap-3 rounded-md bg-background/60 p-3"
                  >
                    <div className="size-4 shrink-0 rounded bg-muted" />

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-muted" />
                      <div className="h-3 w-1/3 rounded bg-muted" />
                    </div>

                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-5 w-20 rounded bg-muted" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
export default TaskListSkeleton;

const ProjectCommentsSkeleton = () => {
  return (
    <section className="animate-pulse">
      <div className="border-b pb-8">
        <div className="rounded-md border p-4">
          <div className="flex items-start gap-3">
            <div className="size-8 shrink-0 rounded-full bg-muted" />

            <div className="flex-1 space-y-3">
              <div className="h-10 w-full rounded-md bg-muted" />

              <div className="flex items-center justify-between gap-4">
                <div className="h-9 w-40 rounded-md bg-muted" />
                <div className="h-9 w-24 rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>

        <div className="h-8 w-28 rounded-md bg-muted" />
      </div>

      <div>
        {Array.from({ length: 4 }).map((_, i) => (
          <article key={i} className="flex gap-2 pb-6">
            <div className="shrink-0">
              <div className="size-8 rounded-full bg-muted" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>

              <div className="my-2 h-3 w-40 rounded bg-muted" />

              <div className="space-y-2">
                <div className="h-4 w-full max-w-lg rounded bg-muted" />
                <div className="h-4 w-2/3 max-w-md rounded bg-muted" />
              </div>

              <div className="mt-3 flex items-center gap-6">
                <div className="h-4 w-24 rounded bg-muted" />
              </div>

              {i === 0 && (
                <div className="mt-4 space-y-4">
                  {Array.from({ length: 2 }).map((_, replyIndex) => (
                    <article key={replyIndex} className="flex gap-2">
                      <div className="size-7 shrink-0 rounded-full bg-muted" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-24 rounded bg-muted" />
                          <div className="h-3 w-16 rounded bg-muted" />
                        </div>

                        <div className="my-2 h-3 w-32 rounded bg-muted" />

                        <div className="space-y-2">
                          <div className="h-4 w-2/3 rounded bg-muted" />
                          <div className="h-4 w-1/2 rounded bg-muted" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-2 h-5 w-28 rounded bg-muted" />
    </section>
  );
};
export default ProjectCommentsSkeleton;

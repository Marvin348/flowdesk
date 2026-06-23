const ActivityPageSkeleton = () => {
  const activities = [
    { messageWidth: "w-72", hasComment: true },
    { messageWidth: "w-56", hasComment: false },
    { messageWidth: "w-64", hasComment: false },
    { messageWidth: "w-80", hasComment: true },
    { messageWidth: "w-60", hasComment: false },
    { messageWidth: "w-72", hasComment: false },
    { messageWidth: "w-72", hasComment: false },
    { messageWidth: "w-72", hasComment: false },
    { messageWidth: "w-72", hasComment: false },
    { messageWidth: "w-72", hasComment: true },
  ];

  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-28 rounded bg-muted" />
        <div className="h-8 w-24 rounded-md bg-muted" />
      </div>

      <section className="mt-12">
        {activities.map(({ messageWidth, hasComment }, index) => (
          <div className="flex gap-4" key={index}>
            <div className="flex flex-col items-center">
              <div className="size-7 shrink-0 rounded-full bg-muted" />
              {index !== activities.length - 1 && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>

            <div className="flex min-w-0 flex-1 gap-3 pb-6">
              <div className="size-8 shrink-0 rounded-full bg-muted" />

              <div className="min-w-0 flex-1 pt-1.5">
                <div className="flex flex-wrap items-center gap-1">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div
                    className={`h-4 max-w-full rounded bg-muted ${messageWidth}`}
                  />
                  <div className="h-4 w-14 rounded bg-muted" />
                </div>

                {hasComment && (
                  <div className="mt-2 w-full max-w-md rounded-md border bg-card p-3">
                    <div className="h-4 w-11/12 rounded bg-muted" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
export default ActivityPageSkeleton;

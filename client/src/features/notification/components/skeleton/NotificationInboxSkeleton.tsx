const NotificationInboxSkeleton = () => {
  const items = [
    { messageWidth: "w-64", isUnread: true, metaWidth: "w-48" },
    { messageWidth: "w-80", isUnread: false, metaWidth: "w-56" },
    { messageWidth: "w-72", isUnread: true, metaWidth: "w-44" },
    { messageWidth: "w-60", isUnread: false, metaWidth: "w-52" },
    { messageWidth: "w-56", isUnread: false, metaWidth: "w-48" },
    { messageWidth: "w-64", isUnread: true, metaWidth: "w-40" },
  ];

  return (
    <div className="animate-pulse" aria-hidden="true">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-2 rounded-md border border-border bg-card p-1 shadow-xs">
          <div className="h-8 w-16 rounded-md bg-muted" />
          <div className="h-8 w-20 rounded-md bg-muted" />
          <div className="h-8 w-20 rounded-md bg-muted" />
        </div>

        <div className="h-9 w-32 rounded-md border border-border bg-muted" />
      </section>

      <section className="overflow-hidden rounded-md border border-border bg-card shadow-xs">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div>
              <div className="h-4 w-12 rounded bg-muted" />
              <div className="mt-2 h-3 w-44 rounded bg-muted" />
            </div>
            <div className="size-8 rounded-md bg-muted" />
          </div>
        </div>

        <div>
          {items.map(({ messageWidth, isUnread, metaWidth }, index) => (
            <article
              className={`grid gap-4 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] ${
                isUnread ? "bg-muted/3" : "bg-card"
              }`}
              key={index}
            >
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted">
                <div className="size-5 rounded bg-background/70" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {isUnread && (
                    <div className="size-2 rounded-full bg-muted" />
                  )}
                  <div
                    className={`h-4 max-w-full rounded bg-muted ${messageWidth}`}
                  />
                  <div className="h-6 w-20 rounded-md border border-border bg-background" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className={`h-3 rounded bg-muted ${metaWidth}`} />
                  <div className="size-1 rounded-full bg-border" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="h-3 w-14 rounded bg-muted" />
                <div className="h-8 w-9 rounded-md bg-muted" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
export default NotificationInboxSkeleton;

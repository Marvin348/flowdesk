const TaskFormSkeleton = () => {
  return (
    <div className="animate-pulse text-foreground" aria-hidden="true">
      <div className="border-b pb-4">
        <div className="h-7 w-48 rounded bg-muted" />
      </div>

      <div className="mt-6">
        <div className="rounded-md border p-2">
          <div className="h-4 w-36 rounded bg-muted" />

          <div className="mt-1">
            <div className="h-10 w-full rounded-md border bg-muted" />
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <div className="flex h-8 w-28 items-center gap-1 rounded-full bg-muted">
              <div className="size-8 rounded-full bg-background/60" />
              <div className="h-3 w-14 rounded bg-background/60" />
            </div>
            <div className="flex h-8 w-32 items-center gap-1 rounded-full bg-muted">
              <div className="size-8 rounded-full bg-background/60" />
              <div className="h-3 w-16 rounded bg-background/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="grid grid-cols-2 items-center">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-muted" />
            <div className="h-4 w-12 rounded bg-muted" />
          </div>
          <div className="h-9 w-full rounded-md bg-muted" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-muted" />
          <div className="h-4 w-14 rounded bg-muted" />
        </div>
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>

      <div className="mt-4 grid grid-cols-2 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>

      <div className="mt-4 grid grid-cols-2 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="mb-1 h-4 w-40 rounded bg-muted" />
        <div className="h-20 w-full rounded-md bg-muted" />
      </div>

      <div className="mt-4 flex items-center justify-end gap-6 border-t pt-4">
        <div className="h-8 w-20 rounded-md bg-muted" />
        <div className="h-8 w-30 rounded-md bg-muted" />
      </div>
    </div>
  );
};
export default TaskFormSkeleton;

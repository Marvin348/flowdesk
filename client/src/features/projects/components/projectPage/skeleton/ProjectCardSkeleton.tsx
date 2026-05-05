const ProjectCardSkeleton = () => {
  return (
    <div className="rounded-md border p-4 animate-pulse">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="h-5 w-40 rounded bg-muted" />

        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-muted" />
          <div className="h-5 w-16 rounded-xl bg-muted" />
        </div>
      </div>

      <div className="my-4">
        <div className="mb-4">
          <div className="h-2 w-full rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 h-3 w-10 rounded bg-muted" />
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full bg-muted" />
              <div className="size-8 rounded-full bg-muted" />
              <div className="size-8 rounded-full bg-muted" />
            </div>
          </div>

          <div>
            <div className="mb-2 h-3 w-16 rounded bg-muted" />
            <div className="flex items-center gap-1">
              <div className="size-4 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-6 w-20 rounded-xl bg-muted" />
          <div className="h-6 w-16 rounded-xl bg-muted" />
        </div>
      </div>

      <div className="border-t pt-2 flex items-center justify-end gap-4">
        <div className="h-4 w-8 rounded bg-muted" />
        <div className="h-4 w-8 rounded bg-muted" />
      </div>
    </div>
  );
};
export default ProjectCardSkeleton;

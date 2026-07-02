const ProfileSettingsSkeleton = () => {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="border-b pb-4">
        <div className="h-6 w-20 rounded bg-muted" />
        <div className="mt-2 h-4 w-full max-w-md rounded bg-muted" />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-md border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 shrink-0 rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-52 max-w-full rounded bg-muted" />
          </div>
        </div>
        <div className="h-8 w-28 rounded-md bg-muted" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-10 w-full rounded-md bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <div className="h-9 w-24 rounded-md bg-muted" />
        <div className="h-9 w-40 rounded-md bg-muted" />
      </div>
    </div>
  );
};
export default ProfileSettingsSkeleton;

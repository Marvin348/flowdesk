const UserDetailsSkeleton = () => {
  return (
    <div className="rounded-md border p-4 space-y-6 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="size-20 rounded-full bg-muted" />
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="h-9 rounded-md bg-muted" />
        <div className="h-9 rounded-md bg-muted" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            <div className="mb-2 h-5 w-40 rounded bg-muted" />
            <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  );
};
export default UserDetailsSkeleton;

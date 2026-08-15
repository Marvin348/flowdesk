const ProjectAttachmentListSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 animate-pulse">
      <div>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-sm text-left">
              <tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="py-3 px-4">
                    <div className="h-4 w-20 rounded bg-background/60" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <div className="size-4 rounded bg-background/60" />
                      </div>

                      <div className="min-w-0">
                        <div className="h-4 w-40 rounded bg-muted" />

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <div className="h-3 w-14 rounded bg-muted" />
                          <div className="h-3 w-20 rounded bg-muted md:hidden" />
                        </div>

                        <div className="mt-3 space-y-2 md:hidden">
                          <div className="h-3 w-36 rounded bg-muted" />
                          <div className="h-3 w-32 rounded bg-muted" />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-muted" />
                      <div className="h-3 w-32 rounded bg-muted" />
                    </div>
                  </td>

                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="size-7 shrink-0 rounded-full bg-muted" />

                      <div className="min-w-0 space-y-2">
                        <div className="h-4 w-28 rounded bg-muted" />
                        <div className="h-3 w-40 rounded bg-muted" />
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="h-4 w-24 rounded bg-muted" />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="size-8 rounded-md bg-muted" />
                      <div className="size-8 rounded-md bg-muted" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ProjectAttachmentListSkeleton;

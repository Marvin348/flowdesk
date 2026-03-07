import type { UserWorkload } from "@/utils/workload/getUserWorkload";
import { getWorkloadStatus } from "@/utils/workload/ui/getWorkloadStatus";
import { WORKLOAD_STATUS } from "@/constants/workload/workload-status";
import Avatar from "@/components/projects/avatar/Avatar";

type WorkloadTableProps = {
  stats: UserWorkload[];
  variant?: "compact" | "full";
};

const WorkloadTable = ({ stats, variant }: WorkloadTableProps) => {
  const TABLE_OPTIONS = ["Name", "Total", "Offene", "Status"];
  const isFull = variant === "full";

  const wrapperClass = isFull ? "border rounded-md overflow-hidden" : "";
  const headerClass = isFull
    ? "hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] bg-muted-foreground/10 p-2 text-surface/90"
    : "hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] border-b pb-1 text-sm text-muted-foreground";

  const desktopRowClass = isFull
    ? "hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-2 border-b"
    : "hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-2 border-b last:border-none";

  const mobileRowClass = isFull
    ? "sm:hidden border-b last:border-none p-3"
    : "sm:hidden border-b last:border-none py-3";

  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        {TABLE_OPTIONS.map((opt) => (
          <p key={opt}>{opt}</p>
        ))}
      </div>

      <div>
        {stats.map((sta) => {
          const status = getWorkloadStatus(sta.progressPercent);

          return (
            <div key={sta.user.id}>
              <div className={mobileRowClass}>
                <div className="flex items-center gap-3">
                  <Avatar avatarKey={sta.user.avatarKey} />
                  <div className="min-w-0">
                    <p className="truncate">{sta.user.name}</p>
                    {isFull && sta.user.jobTitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {sta.user.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <span className="rounded-md bg-muted px-2 py-1">
                    Total: {sta.totalTasks}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1">
                    Offene: {sta.openCount}
                  </span>
                  <span
                    className="flex items-center gap-2 rounded-full px-2 py-1"
                    style={{
                      color: WORKLOAD_STATUS[status].color,
                      backgroundColor: WORKLOAD_STATUS[status].bg,
                    }}
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: WORKLOAD_STATUS[status].color,
                      }}
                    />
                    {WORKLOAD_STATUS[status].label}
                  </span>
                </div>
              </div>


              <div className={desktopRowClass}>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar avatarKey={sta.user.avatarKey} />
                  <div className="min-w-0">
                    <p className="truncate">{sta.user.name}</p>
                    {isFull && sta.user.jobTitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {sta.user.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                <p>{sta.totalTasks}</p>
                <p>{sta.openCount}</p>

                <p
                  className="flex w-fit items-center gap-2 rounded-full px-2 py-0.5 text-sm"
                  style={{
                    color: WORKLOAD_STATUS[status].color,
                    backgroundColor: WORKLOAD_STATUS[status].bg,
                  }}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: WORKLOAD_STATUS[status].color,
                    }}
                  />
                  {WORKLOAD_STATUS[status].label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WorkloadTable;

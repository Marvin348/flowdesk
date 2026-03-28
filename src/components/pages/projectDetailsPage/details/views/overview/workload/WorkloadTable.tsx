import type { UserWorkload } from "@/utils/workload/getUserWorkload";
import { getWorkloadStatus } from "@/utils/workload/ui/getWorkloadStatus";
import { WORKLOAD_STATUS } from "@/constants/workload/workload-status";
import Avatar from "@/components/projects/avatar/Avatar";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { getSortedWorkloadStats } from "@/utils/workload/getSortedWorkloadStats";

type WorkloadTableProps = {
  stats: UserWorkload[];
  variant?: "compact" | "full";
};

type SortKey = "name" | "total" | "open" | "status";

export type SortedBy = {
  sortKey?: SortKey;
  sortDirection?: "asc" | "desc";
};

const WorkloadTable = ({ stats, variant }: WorkloadTableProps) => {
  const [sortedBy, setSortedBy] = useState<SortedBy | null>(null);

  const toggleSortedBy = (value: SortKey) =>
    setSortedBy((prev) => {
      if (prev?.sortKey !== value) {
        return {
          sortKey: value,
          sortDirection: "asc",
        };
      }

      return {
        sortKey: value,
        sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
      };
    });

  const sortedWorkloadStats = getSortedWorkloadStats(stats, sortedBy);

  const TABLE_OPTIONS = [
    { label: "Name", value: "name" },
    { label: "Total", value: "total" },
    { label: "Offene", value: "open" },
    { label: "Status", value: "status" },
  ] as const;

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
          <button
            key={opt.value}
            className="w-fit flex items-center gap-1"
            onClick={() => toggleSortedBy(opt.value)}
          >
            {opt.label} <ChevronsUpDown className="size-4 text-surface/80" />
          </button>
        ))}
      </div>

      <div>
        {sortedWorkloadStats.map((sta) => {
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

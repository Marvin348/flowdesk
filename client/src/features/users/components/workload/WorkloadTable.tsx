import { getStatusFromProgress } from "@shared/utils/getStatusFromProgress";
import { PROGRESS_STATUS } from "@/shared/constants/progress-status";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { ChevronsUpDown } from "lucide-react";
import { WORKLOAD_TABLE_OPTIONS } from "@/shared/constants/table-header";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";

type WorkloadTableProps = {
  workload: UserWorkload[];
  onSort: (sortKey: WorkloadSortKey) => void;
  hasLoaded: boolean;
};

export type WorkloadSortKey =
  | "name"
  | "totalTasks"
  | "openTasks"
  | "progressStatus";

const WorkloadTable = ({ workload, hasLoaded, onSort }: WorkloadTableProps) => {
  return (
    <section className="border rounded-md overflow-hidden">
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] bg-muted p-2 text-muted-foreground">
        {WORKLOAD_TABLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="w-fit flex items-center gap-1 text-foreground"
            onClick={() => onSort(opt.value)}
          >
            {opt.label}{" "}
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {!workload.length && hasLoaded && (
        <div className="p-4 text-center text-muted-foreground text-sm">
          Keine Daten vorhanden
        </div>
      )}

      <div>
        {workload.map((sta) => {
          const status = getStatusFromProgress(sta.progressPercent);

          return (
            <div key={sta.user.id} className="border-b last:border-none">
              <div className="sm:hidden border-b last:border-none p-3">
                <div className="flex items-center gap-3">
                  <Avatar avatarKey={sta.user.avatarKey} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate">{sta.user.name}</p>
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
                      color: PROGRESS_STATUS[status].color,
                      backgroundColor: PROGRESS_STATUS[status].bg,
                    }}
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: PROGRESS_STATUS[status].color,
                      }}
                    />
                    {PROGRESS_STATUS[status].label}
                  </span>
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar avatarKey={sta.user.avatarKey} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate">{sta.user.name}</p>
                  </div>
                </div>

                <p>{sta.totalTasks}</p>
                <p>{sta.openCount}</p>

                <p
                  className="flex w-fit items-center gap-2 rounded-full px-2 py-0.5 text-sm"
                  style={{
                    color: PROGRESS_STATUS[status].color,
                    backgroundColor: PROGRESS_STATUS[status].bg,
                  }}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: PROGRESS_STATUS[status].color,
                    }}
                  />
                  {PROGRESS_STATUS[status].label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default WorkloadTable;

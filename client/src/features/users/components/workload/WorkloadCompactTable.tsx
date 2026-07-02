import Avatar from "@/shared/components/ui/avatar/Avatar";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import { getStatusFromProgress } from "@shared/utils/getStatusFromProgress";
import { PROGRESS_STATUS } from "@/shared/constants/progress-status";

type WorkloadCompactTableProps = {
  workload: UserWorkload[];
};

const WorkloadCompactTable = ({ workload }: WorkloadCompactTableProps) => {
  if (!workload.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Keine Daten vorhanden
      </div>
    );
  }

  const tableHeaders = ["Name", "Total", "Offene", "Status"];

  return (
    <section>
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] border-b pb-1 text-sm text-muted-foreground">
        {tableHeaders.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>

      <div>
        {workload.map((sta) => {
          const status = getStatusFromProgress(sta.progressPercent);

          return (
            <div key={sta.user.id}>
              <div className="sm:hidden border-b last:border-none py-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    avatarKey={sta.user.avatarKey}
                    avatarUrl={sta.user.avatarUrl}
                    size="sm"
                  />
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

              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-2 border-b last:border-none">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    avatarKey={sta.user.avatarKey}
                    avatarUrl={sta.user.avatarUrl}
                    size="sm"
                  />
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
export default WorkloadCompactTable;

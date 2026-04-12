import type { UserPerformance } from "@/utils/performance/getUserPerformance";
import { getStatusFromProgress } from "@/utils/workload/ui/getStatusFromProgress";
import { PROGRESS_STATUS } from "@/constants/progress-status";
import Avatar from "@/components/users/avatar/Avatar";

type TeamPerformanceItemProps = {
  item: UserPerformance;
};

const TeamPerformanceItem = ({ item }: TeamPerformanceItemProps) => {
  const { id, name, jobTitle, avatarKey, stats } = item;

  const minPercent =
    stats.progressPercent === 0 ? "5%" : `${stats.progressPercent}%`;

  const status = getStatusFromProgress(stats.progressPercent);

  return (
    <div className="text-surface/90 border rounded-md p-4">
      <div className="flex items-center gap-4">
        <Avatar avatarKey={avatarKey} size="lg" />
        <div>
          <p className="text-lg">{name}</p>
          <p className="text-muted-foreground text-sm">{jobTitle}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          {stats.tasksCount}
        </p>
        <p className="mt-1 flex items-center justify-between">
          <span className="text-muted-foreground">Offene </span>
          {stats.openTasks}
        </p>
        <p className="mt-1 flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <span
            className="flex items-center gap-2 text-sm rounded-full px-2 py-0.5"
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
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Auslastung</p>
          <p>
            {stats.completedCount}/{stats.tasksCount}
          </p>
        </div>
        <div className="bg-gray-200 rounded-full">
          <div
            style={{
              width: minPercent,
            }}
            className="bg-accent h-2 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  );
};
export default TeamPerformanceItem;

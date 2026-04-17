import type { UserPerformance } from "@/utils/performance/getUserPerformance";
import { getStatusFromProgress } from "@/utils/workload/ui/getStatusFromProgress";
import { PROGRESS_STATUS } from "@/constants/progress-status";
import Avatar from "@/components/users/avatar/Avatar";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { USER_ROLE_OPTIONS } from "@/constants/user/user-role-options";

type TeamPerformanceItemProps = {
  item: UserPerformance;
  onSelectUser: (id: string, name: string) => void;
};

const TeamPerformanceItem = ({
  item,
  onSelectUser,
}: TeamPerformanceItemProps) => {
  const { id, name, jobTitle, avatarKey, role, stats } = item;

  const minPercent =
    stats.progressPercent === 0 ? "5%" : `${stats.progressPercent}%`;

  const status = getStatusFromProgress(stats.progressPercent);

  const UserRoleIcon = USER_ROLE_OPTIONS[role].icon;

  return (
    <div className="text-surface/90 border rounded-md p-4">
      <div className="flex items-center gap-4">
        <Avatar avatarKey={avatarKey} size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <UserRoleIcon className="size-4 text-surface/80" />
            <p className="text-lg">{name}</p>
          </div>
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

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-8 px-4 hover:bg-surface/3"
          onClick={() => onSelectUser(id, name)}
        >
          Projekt zuweisen
        </Button>
        <Button variant="outline" className="h-8 hover:bg-surface/3">
          Mehr Infos <ArrowRight />
        </Button>
      </div>
    </div>
  );
};
export default TeamPerformanceItem;

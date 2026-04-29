import type { UserPerformance } from "@/utils/performance/getUserPerformance";
import { getStatusFromProgress } from "@/utils/workload/ui/getStatusFromProgress";
import { PROGRESS_STATUS } from "@/constants/progress-status";
import Avatar from "@/components/users/avatar/Avatar";
import { USER_ROLE_OPTIONS } from "@/constants/user/user-role-options";
import type { SelectedUser } from "@/pages/TeamPage";
import { Button } from "@/components/ui/button";

type TeamPerformanceItemProps = {
  item: UserPerformance;
  onShowDetails: (user: SelectedUser) => void;
};

const TeamPerformanceItem = ({
  item,
  onShowDetails,
}: TeamPerformanceItemProps) => {
  const { id, name, jobTitle, avatarKey, role, stats } = item;

  const minPercent =
    stats.progressPercent === 0 ? "5%" : `${stats.progressPercent}%`;

  const status = getStatusFromProgress(stats.progressPercent);

  const UserRoleIcon = USER_ROLE_OPTIONS[role].icon;

  //   <div className="text-surface/90 border rounded-md p-4">
  //   <div className="flex items-center gap-4">
  //     <Avatar avatarKey={avatarKey} size="lg" />
  //     <div>
  //       <div className="flex items-center gap-2">
  //         <UserRoleIcon className="size-4 text-surface/80" />
  //         <p className="text-lg">{name}</p>
  //       </div>
  //       <p className="text-muted-foreground text-sm">{jobTitle}</p>
  //     </div>
  //   </div>

  //   <div className="mt-4">
  //     <p className="flex items-center justify-between">
  //       <span className="text-muted-foreground">Total</span>
  //       {stats.tasksCount}
  //     </p>
  //     <p className="mt-1 flex items-center justify-between">
  //       <span className="text-muted-foreground">Offene </span>
  //       {stats.openTasks}
  //     </p>
  //     <p className="mt-1 flex items-center justify-between">
  //       <span className="text-muted-foreground">Status</span>
  //       <span
  //         className="flex items-center gap-2 text-sm rounded-full px-2 py-0.5"
  //         style={{
  //           color: PROGRESS_STATUS[status].color,
  //           backgroundColor: PROGRESS_STATUS[status].bg,
  //         }}
  //       >
  //         <span
  //           className="size-2 shrink-0 rounded-full"
  //           style={{
  //             backgroundColor: PROGRESS_STATUS[status].color,
  //           }}
  //         />
  //         {PROGRESS_STATUS[status].label}
  //       </span>
  //     </p>
  //   </div>

  //   <div className="mt-4">
  //     <div className="flex items-center justify-between">
  //       <p className="text-muted-foreground">Auslastung</p>
  //       <p>
  //         {stats.completedCount}/{stats.tasksCount}
  //       </p>
  //     </div>
  //     <div className="bg-gray-200 rounded-full">
  //       <div
  //         style={{
  //           width: minPercent,
  //         }}
  //         className="bg-accent h-2 rounded-full"
  //       ></div>
  //     </div>
  //   </div>

  //   <div className="hidden md:inline">
  //     <button
  //       className="mt-4 text-end w-full gap-0.5 text-sm text-muted-foreground underline duration-200 hover:text-surface/80"
  //       onClick={() => onShowDetails({ id, name })}
  //     >
  //       Mehr Infos
  //     </button>
  //   </div>
  // </div>

  return (
    <>
      <div className="border p-4 rounded-md">
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
        <p className="mt-4 flex items-center justify-between">
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

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Aufgaben</p>
            <p className="text-lg font-medium">{stats.tasksCount}</p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Offen</p>
            <p className="text-lg font-medium">{stats.openTasks}</p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Load</p>
            <p className="text-lg font-medium">
              {stats.completedCount}/{stats.tasksCount}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Auslastung</p>
            <p className="font-medium text-sm">
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

        <div className="flex justify-end mt-4">
          <Button
            variant="link"
            size="sm"
            className="px-0 font-normal"
            onClick={() => onShowDetails({ id, name })}
          >
            Mehr Infos
          </Button>
        </div>
      </div>
    </>
  );
};
export default TeamPerformanceItem;

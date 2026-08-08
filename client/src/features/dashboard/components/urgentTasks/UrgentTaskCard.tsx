import type { DashboardUrgentTask } from "@shared/types/dto/dashboard/dashboardUrgentTasks.dto";
import { formatDate } from "@/shared/utils/formatDate";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { Link } from "react-router";
import { FolderKanban } from "lucide-react";

type UrgentTaskCardProps = {
  task: DashboardUrgentTask;
};

const UrgentTaskCard = ({ task }: UrgentTaskCardProps) => {
  const priorityConfig = PRIORITY_OPTIONS[task.taskPriority];
  const statusConfig = STATUS_OPTIONS[task.taskStatus];

  return (
    <article
      key={task.id}
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3"
    >
      <div className="min-w-0">
        <p className="truncate font-medium">{task.title}</p>
        <Link
          to={`/project/${task.project.id}`}
          className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-sm text-muted-foreground hover:text-foreground"
        >
          <FolderKanban className="size-4 shrink-0" />
          <span className="truncate">{task.project.title}</span>
        </Link>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
        <span className="text-muted-foreground">
          {formatDate(task.dueDate)}
        </span>

        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="rounded-md px-2 py-0.5 text-xs text-surface-foreground" style={{backgroundColor: priorityConfig.color}}>
            {priorityConfig.label}
          </span>
          <span className="rounded-md px-2 py-0.5 text-xs text-surface-foreground" style={{backgroundColor: statusConfig.color}}>
            {statusConfig.label}
          </span>
        </div>
      </div>
    </article>
  );
};
export default UrgentTaskCard;

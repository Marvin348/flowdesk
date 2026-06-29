import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import AssigneeAvatars from "@/shared/components/ui/avatar/AvatarGroup";
import { formatDate } from "@/shared/utils/formatDate";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { StatusBase } from "@shared/types/StatusBase";
import { TASK_STATUS_ACTIONS } from "@/features/tasks/constants/taskStatusActions";

type TaskRowProps = {
  task: ProjectTaskDto;
  handleStatusChange: (id: string, status: StatusBase) => void;
  isUpdating: boolean;
};

const TaskRow = ({ task, handleStatusChange, isUpdating }: TaskRowProps) => {
  const { id, title, dueDate, taskStatus, collaborators, taskPriority } = task;

  const statusAction = TASK_STATUS_ACTIONS[taskStatus];

  return (
    <div className="py-4 grid grid-cols-1 md:grid-cols-6 items-center gap-4 border-b last:border-none">
      <p className="truncate">{title}</p>

      <div>
        <AssigneeAvatars users={collaborators} />
      </div>

      <div className="md:justify-self-start flex items-center gap-4 text-sm">
        <p>{formatDate(dueDate)}</p>
      </div>

      <p
        style={{ backgroundColor: STATUS_OPTIONS[taskStatus].color }}
        className="w-fit px-2 rounded-full"
      >
        {STATUS_OPTIONS[taskStatus].label}
      </p>

      <p
        style={{ backgroundColor: PRIORITY_OPTIONS[taskPriority].color }}
        className="text-sm w-fit px-2 rounded-full"
      >
        {PRIORITY_OPTIONS[taskPriority].label}
      </p>

      <button
        disabled={isUpdating}
        onClick={() => handleStatusChange(id, statusAction.nextStatus)}
        className="md:justify-self-start text-sm font-medium text-muted-foreground hover:text-foreground duration-200"
      >
        {isUpdating ? "Speichert..." : statusAction.label}
      </button>
    </div>
  );
};
export default TaskRow;

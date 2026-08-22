import { TASK_STATUS_ACTIONS } from "@/features/tasks/constants/taskStatusActions";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { StatusBase } from "@shared/types/StatusBase";
import { useAppStore } from "@/store";

type TaskDropdownMenuProps = {
  task: ProjectTaskDto;
  handleStatusChange: (id: string, status: StatusBase) => void;
  isUpdating: boolean;
};

const TaskDropdownMenu = ({
  task,
  handleStatusChange,
  isUpdating,
}: TaskDropdownMenuProps) => {
  const { id, taskStatus, projectId } = task;

  const openEditTask = useAppStore((state) => state.openEditTask);

  const statusAction = TASK_STATUS_ACTIONS[taskStatus];

  return (
    <div className="absolute right-0 top-7 z-10 min-w-40 rounded-md border bg-background p-1 shadow-md">
      <div className="mb-1">
        <button
          disabled={isUpdating}
          onClick={() => handleStatusChange(id, statusAction.nextStatus)}
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground duration-200 hover:bg-muted hover:text-foreground outline-none disabled:pointer-events-none disabled:opacity-60"
        >
          {isUpdating ? "Speichert..." : statusAction.label}
        </button>
      </div>

      <div className="border-t mt-1">
        <button
          className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground duration-200 hover:bg-muted hover:text-foreground outline-none"
          onClick={() => openEditTask(projectId, id)}
        >
          Bearbeiten
        </button>
      </div>
    </div>
  );
};
export default TaskDropdownMenu;

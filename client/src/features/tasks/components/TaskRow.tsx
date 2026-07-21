import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import AssigneeAvatars from "@/shared/components/ui/avatar/AvatarGroup";
import { formatDate } from "@/shared/utils/formatDate";
import { PRIORITY_OPTIONS } from "@/shared/constants/priority-options";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { StatusBase } from "@shared/types/StatusBase";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";
import TaskDropdownMenu from "./TaskDropdownMenu";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

type TaskRowProps = {
  task: ProjectTaskDto;
  handleStatusChange: (id: string, status: StatusBase) => void;
  isUpdating: boolean;
};

const TaskRow = ({ task, handleStatusChange, isUpdating }: TaskRowProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { title, dueDate, taskStatus, collaborators, taskPriority } = task;

  const useDropdownRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(useDropdownRef, () => setIsDropdownOpen(false));

  return (
    <div className="p-3 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center  border-b last:border-none">
      <p className="truncate">{title}</p>

      <div>
        <AssigneeAvatars users={collaborators} />
      </div>

      <div className="flex items-center gap-4 text-sm">
        <p>{formatDate(dueDate)}</p>
      </div>

      <p
        style={{ backgroundColor: STATUS_OPTIONS[taskStatus].color }}
        className="w-fit px-2 rounded-full text-surface-foreground text-sm"
      >
        {STATUS_OPTIONS[taskStatus].label}
      </p>

      <p
        style={{ backgroundColor: PRIORITY_OPTIONS[taskPriority].color }}
        className="text-sm w-fit px-2 rounded-full text-surface-foreground"
      >
        {PRIORITY_OPTIONS[taskPriority].label}
      </p>

      <div ref={useDropdownRef} className="relative">
        <button onClick={() => setIsDropdownOpen((prev) => !prev)}>
          <EllipsisVertical className="size-5" />
        </button>

        {isDropdownOpen && (
          <TaskDropdownMenu
            task={task}
            handleStatusChange={handleStatusChange}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
};
export default TaskRow;

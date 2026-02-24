import type { TaskWithMeta } from "@/type/taskWithMeta";
import { STATUS_OPTIONS } from "@/constants/status-options";
import AssigneeAvatars from "@/components/projects/avatar/AssigneeAvatars";
import { formatDate } from "@/utils/formatDate";

const TaskRow = ({ task }: { task: TaskWithMeta }) => {
  const { title, dueDate, taskStatus, collaborators } = task;

  return (
    <div className="py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-b last:border-none">
      <p className="font-medium truncate">{title}</p>

      <div className="md:justify-self-center">
        <AssigneeAvatars users={collaborators} />
      </div>

      <div className="md:justify-self-start flex items-center gap-4 text-sm">
        <p>{formatDate(dueDate)}</p>
        <p
          style={{ backgroundColor: STATUS_OPTIONS[taskStatus].color }}
          className="w-fit px-2 rounded-full"
        >
          {STATUS_OPTIONS[taskStatus].label}
        </p>
      </div>
    </div>
  );
};
export default TaskRow;

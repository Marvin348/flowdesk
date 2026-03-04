import type { Task } from "@/type/task";
import AssigneeAvatars from "@/components/projects/avatar/AssigneeAvatars";
import type { User } from "@/type/user";
import { formatDate } from "@/utils/formatDate";

type OpenTaskProps = {
  task: Task;
  users: User[];
};
const OpenTask = ({ task, users }: OpenTaskProps) => {
  return (
    <>
      <div>
        <p className="text-muted-foreground text-sm mb-1">Aufgabe</p>
        <p>{task.title}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-muted-foreground text-sm mb-1">Team</p>
          <AssigneeAvatars users={users} />
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-1">Timeline</p>
          <p>{formatDate(task.dueDate)}</p>
        </div>
      </div>

      {task.description && (
        <div className="mt-4">
          <p className="text-muted-foreground text-sm mb-1">Beschreibung</p>
          <p>{task.description}</p>
        </div>
      )}
    </>
  );
};
export default OpenTask;

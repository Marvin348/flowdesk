import AssigneeAvatars from "@/components/projects/avatar/AssigneeAvatars";
import { formatDate } from "@/utils/formatDate";
import type { TaskWithMeta } from "@/type/taskWithMeta";

type OpenTaskProps = {
  task: TaskWithMeta;
};
const OpenTask = ({ task }: OpenTaskProps) => {
  return (
    <>
      <div>
        <p className="text-muted-foreground text-sm mb-1">Aufgabe</p>
        <p>{task.title}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-muted-foreground text-sm mb-1">Team</p>
          <div>
            <AssigneeAvatars users={task.collaborators} />
          </div>
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

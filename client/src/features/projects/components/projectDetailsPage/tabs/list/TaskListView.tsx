import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import type { StatusBase } from "@shared/types/StatusBase";
import TaskRow from "@/features/tasks/components/TaskRow";
import { useProjectTasks } from "@/features/projects/hooks/details/useProjectTasks";
import TaskListSkeleton from "@/features/projects/components/projectDetailsPage/tabs/list/TaskListSkeleton";
import { useUpdateTaskStatus } from "@/features/tasks/hooks/useUpdateTaskStatus";
import ErrorMessage from "@/shared/components/ErrorMessage";
import TaskTableHeader from "@/features/tasks/components/TaskTableHeader";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store";

type TaskListViewProps = {
  projectId: string;
};

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const { data, isLoading, error } = useProjectTasks(projectId);
  const { mutate, isPending, isError, variables } =
    useUpdateTaskStatus(projectId);

  const openCreateTask = useAppStore((state) => state.openCreateTask);

  const tasks = data?.tasks ?? [];

  if (isLoading && !data) return <TaskListSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;

  const handleStatusChange = (taskId: string, taskStatus: StatusBase) => {
    mutate({ taskId, taskStatus });
  };

  return (
    <div>
      <section>
        {Object.values(STATUS_OPTIONS).map((opt) => {
          const tasksForStatus = tasks.filter(
            (task) => task.taskStatus === opt.value,
          );
          const Icon = opt.icon;

          return (
            <section key={opt.value} className="mb-6">
              <div className="flex mb-2 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="size-6" style={{ color: opt.color }} />
                  <span>{opt.label}</span>
                  <span
                    style={{ backgroundColor: opt.color }}
                    className="flex items-center justify-center size-5 rounded-sm font-medium text-surface-foreground"
                  >
                    {tasksForStatus.length}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="size-8"
                  onClick={() => openCreateTask(projectId)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="border rounded-md">
                <TaskTableHeader />

                <div>
                  {tasksForStatus.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      handleStatusChange={handleStatusChange}
                      isUpdating={isPending && variables?.taskId === task.id}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </section>

      {isError && (
        <ErrorMessage
          message="Status konnte nicht geändert werden. Bitte versuche es erneut."
          className="mt-4"
        />
      )}
    </div>
  );
};
export default TaskListView;

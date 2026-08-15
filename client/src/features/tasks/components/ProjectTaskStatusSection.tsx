import { Button } from "@/shared/components/ui/button";
import { Plus, ArrowDown } from "lucide-react";
import TaskTableHeader from "@/features/tasks/components/TaskTableHeader";
import TaskRow from "@/features/tasks/components/TaskRow";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useAppStore } from "@/store";
import { useProjectTasksByStatus } from "@/features/projects/hooks/details/useProjectTasksByStatus";
import { useUpdateTaskStatus } from "@/features/tasks/hooks/useUpdateTaskStatus";
import type { StatusBase } from "@shared/types/StatusBase";
import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { StatusOption } from "@/shared/constants/status-options";

type ProjectTaskStatusSectionProps = {
  projectId: string;
  option: StatusOption;
  section: ProjectTasksResponseDto[StatusBase];
};

const ProjectTaskStatusSection = ({
  projectId,
  option,
  section,
}: ProjectTaskStatusSectionProps) => {
  const { mutate, isPending, isError, variables } =
    useUpdateTaskStatus(projectId);

  const { data, fetchNextPage, isFetchingNextPage } = useProjectTasksByStatus({
    projectId,
    taskStatus: option.value,
  });

  const openCreateTask = useAppStore((state) => state.openCreateTask);

  const additionalTasks = data?.pages.flat() ?? [];
  const visibleTasks = [...section.tasks, ...additionalTasks];
  const hasMoreTasks = section.total > visibleTasks.length;

  const Icon = option.icon;

  const handleStatusChange = (taskId: string, taskStatus: StatusBase) => {
    mutate({ taskId, taskStatus });
  };

  return (
    <div>
      <section className="mb-6">
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-6" style={{ color: option.color }} />
            <span>{option.label}</span>
            <span
              style={{ backgroundColor: option.color }}
              className="flex items-center justify-center size-5 rounded-sm font-medium text-surface-foreground"
            >
              {section.total}
            </span>
          </div>
          <Button
            variant="outline"
            className="size-8"
            onClick={() => openCreateTask({ projectId })}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="border rounded-md">
          <TaskTableHeader />

          {visibleTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              handleStatusChange={handleStatusChange}
              isUpdating={isPending && variables?.taskId === task.id}
            />
          ))}

          {hasMoreTasks && (
            <Button
              className="w-full rounded-t-none border-none"
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Mehr anzeigen
              <ArrowDown className="size-4" />
            </Button>
          )}
        </div>
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
export default ProjectTaskStatusSection;

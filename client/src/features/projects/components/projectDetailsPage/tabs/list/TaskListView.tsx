import { useProjectTasksOverview } from "@/features/projects/hooks/details/useProjectTasksOverview";
import TaskListSkeleton from "@/features/projects/components/projectDetailsPage/tabs/list/TaskListSkeleton";
import ProjectTaskStatusSection from "@/features/tasks/components/ProjectTaskStatusSection";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";

type TaskListViewProps = {
  projectId: string;
};

const TaskListView = ({ projectId }: TaskListViewProps) => {
  const { data, isLoading, error } = useProjectTasksOverview(projectId);

  if (isLoading) return <TaskListSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!data) return null;

  const taskSections = data;

  return (
    <>
      {Object.values(STATUS_OPTIONS).map((opt) => (
        <ProjectTaskStatusSection
          key={opt.value}
          projectId={projectId}
          option={opt}
          section={taskSections[opt.value]}
        />
      ))}
    </>
  );
};
export default TaskListView;

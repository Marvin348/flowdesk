import { useProjectTasksOverview } from "@/features/projects/hooks/details/useProjectTasksOverview";
import ProjectTaskPageSkeleton from "@/features/tasks/components/skeleton/ProjectTaskPageSkeleton";
import ProjectTaskStatusSection from "@/features/tasks/components/ProjectTaskStatusSection";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { useProjectContext } from "@/features/projects/hooks/useProjectContext";

const ProjectTasksPage = () => {
  const { projectId } = useProjectContext();

  const { data, isLoading, error } = useProjectTasksOverview(projectId);

  if (isLoading) return <ProjectTaskPageSkeleton />;
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
export default ProjectTasksPage;

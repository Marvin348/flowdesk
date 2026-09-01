import { useProjectDetailsShell } from "@/features/projects/hooks/details/useProjectDetailsShell";
import ProjectDetailsHeader from "@/features/projects/components/projectDetailsPage/ProjectDetailsHeader";
import ProjectTabs from "@/features/projects/components/projectDetailsPage/ProjectTabs";
import { Outlet, useParams } from "react-router";
import InviteUserModal from "@/features/users/components/collaboratorsSelect/InviteUserModal";
import ProjectDetailsSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/ProjectDetailsSkeleton";
import { useAppStore } from "@/store";
import AddTaskPanel from "@/features/tasks/components/create/AddTaskPanel";
import { useProjectRealtime } from "@/realtime/useProjectRealtime";

const ProjectLayout = () => {
  const { projectId } = useParams();

  useProjectRealtime(projectId);

  if (!projectId) return;

  const isProjectInviteOpen = useAppStore((state) => state.isProjectInviteOpen);
  const isTaskModalOpen = useAppStore((state) => state.isOpen);

  const { data: project, isLoading, error } = useProjectDetailsShell(projectId);

  if (isLoading) return <ProjectDetailsSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6">
        <ProjectDetailsHeader project={project} />
      </div>

      <ProjectTabs />

      <div className="mt-6">
        <Outlet context={{ project, projectId }} />
      </div>

      {isProjectInviteOpen && (
        <InviteUserModal
          teamUserIds={project.invitedUserIds}
          projectId={projectId}
        />
      )}

      <AddTaskPanel
        isOpen={isTaskModalOpen}
        projectId={projectId}
        teamUserIds={project.invitedUserIds}
      />
    </div>
  );
};
export default ProjectLayout;

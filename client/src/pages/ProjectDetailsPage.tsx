import { useParams, useSearchParams } from "react-router";
import ProjectDetailsHeader from "@/features/projects/components/projectDetailsPage/ProjectDetailsHeader";
import { useProjectDetailsVM } from "@/domain/projects/useProjectDetails";
import { getProgressResult } from "@/shared/utils/getProgressResult";
import { useUsersByIds } from "@/features/users/hooks/useUsersByIds";
import ProjectTabs from "@/features/projects/components/projectDetailsPage/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/features/projects/components/projectDetailsPage/tabs/files/AttachmentsView";
import ListView from "@/features/projects/components/projectDetailsPage/tabs/list/TaskListView";
import Overview from "@/features/projects/components/projectDetailsPage/tabs/overview/Overview";
import CollaboratorsView from "@/features/projects/components/projectDetailsPage/tabs/collaborators/CollaboratorsView";
import AddTaskPanel from "@/features/tasks/components/create/AddTaskPanel";
import InviteUserModal from "@/features/users/components/collaboratorsSelect/InviteUserModal";
import WorkloadTable from "@/features/projects/components/projectDetailsPage/tabs/workload/WorkloadTable";
import { getProjectUserWorkload } from "@/features/users/utils/workload/getProjectUserWorkload";
import CommentsView from "@/features/projects/components/projectDetailsPage/tabs/comments/CommentsView";
import DetailsOverviewSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/DetailsOverviewSkeleton";

export type ActiveTab =
  | "overview"
  | "list"
  | "files"
  | "collaborators"
  | "workload"
  | "comments";

const ProjectDetailsPage = () => {
  const [searchParams, setSeatchParams] = useSearchParams();
  const { id } = useParams();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<
    string[]
  >([]);

  const projectId = id ?? "";
  const activeTab = (searchParams.get("tab") as ActiveTab) ?? "overview";

  const { project, isLoading, error } = useProjectDetailsVM(projectId);
  const teamUsers = useUsersByIds(project?.teamUserIds ?? []);

  if (isLoading) return <DetailsOverviewSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!project) return <div>Project not found</div>;

  const workloadStats = getProjectUserWorkload(project.tasks);
  const progress = getProgressResult(project.tasks);
  const attachments = project.tasks.flatMap((t) => t.attachments);

  const toggleCollaboratorSelection = (id: string) =>
    setSelectedCollaboratorIds((prev) =>
      prev.includes(id)
        ? prev.filter((collId) => collId !== id)
        : [...prev, id],
    );

  const handleClearSelection = () => setSelectedCollaboratorIds([]);
  const handleCreateTask = () => setIsAddTaskOpen(true);
  const navigateTab = (tab: ActiveTab) => setSeatchParams({ tab });

  const TabViewResult = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            project={project}
            progress={progress}
            collaborator={teamUsers}
            onCreateTask={handleCreateTask}
            inviteOpen={() => setIsInviteOpen(true)}
            onNavigate={navigateTab}
          />
        );

      case "files":
        return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView tasks={project.tasks} />;

      case "collaborators":
        return (
          <CollaboratorsView
            projectId={project.id}
            collaborator={teamUsers}
            onCreateTask={handleCreateTask}
            toggleBulk={toggleCollaboratorSelection}
            selectedCollaboratorIds={selectedCollaboratorIds}
            onClearSelection={handleClearSelection}
          />
        );

      case "workload":
        return <WorkloadTable stats={workloadStats} variant="full" />;

      case "comments":
        return <CommentsView tasks={project.tasks} />;
    }
  };
  return (
    <>
      <div className="mb-6">
        <ProjectDetailsHeader
          project={project}
          progress={progress}
          onOpen={() => setIsInviteOpen(true)}
        />
      </div>

      <div>
        <ProjectTabs activeTab={activeTab} onChange={navigateTab} />
      </div>

      <div className="mt-6">
        <TabViewResult />
      </div>

      <AddTaskPanel
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={projectId}
        teamUserIds={project.teamUserIds ?? []}
        initialCollaboratorIds={selectedCollaboratorIds}
      />

      {isInviteOpen && (
        <InviteUserModal
          onClose={() => setIsInviteOpen(false)}
          onInviteOpen={isInviteOpen}
          teamUserIds={project?.teamUserIds ?? []}
          invitedUserIds={project.invitedUserIds ?? []}
          projectId={projectId}
        />
      )}
    </>
  );
};
export default ProjectDetailsPage;

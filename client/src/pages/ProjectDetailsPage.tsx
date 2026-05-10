import { useParams, useSearchParams } from "react-router";
import ProjectDetailsHeader from "@/features/projects/components/projectDetailsPage/ProjectDetailsHeader";
import { getProgressResult } from "@/shared/utils/getProgressResult";
import ProjectTabs from "@/features/projects/components/projectDetailsPage/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/features/projects/components/projectDetailsPage/tabs/files/AttachmentsView";
import ListView from "@/features/projects/components/projectDetailsPage/tabs/list/TaskListView";
import Overview from "@/features/projects/components/projectDetailsPage/tabs/overview/Overview";
import CollaboratorsView from "@/features/projects/components/projectDetailsPage/tabs/collaborators/CollaboratorsView";
import AddTaskPanel from "@/features/tasks/components/create/AddTaskPanel";
import InviteUserModal from "@/features/users/components/collaboratorsSelect/InviteUserModal";
import CommentsView from "@/features/projects/components/projectDetailsPage/tabs/comments/CommentsView";
import DetailsOverviewSkeleton from "@/features/projects/components/projectDetailsPage/skeleton/DetailsOverviewSkeleton";
import { useProjectDetailsShell } from "@/features/projects/hooks/details/useProjectDetailsShell";
import WorkloadView from "@/features/projects/components/projectDetailsPage/tabs/workload/WorkloadView";
import type { ActiveTab } from "@/features/projects/types/activeTab";

// Nicht vergessen in ProjectsPage Progress zu fetchen, weil anderer key name im backend

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

  const { data: project, isLoading, error } = useProjectDetailsShell(projectId);

  // const realProject = data?.project;
  console.log("projectSHELL", project);

  if (isLoading) return <DetailsOverviewSkeleton />;
  if (error) return <div>Etwas ist schief gelaufen</div>;
  if (!project) return <div>Project not found</div>;

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
            onCreateTask={handleCreateTask}
            inviteOpen={() => setIsInviteOpen(true)}
            onNavigate={navigateTab}
            projectId={project.id}
          />
        );

      // case "files":
      //   return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView projectId={project.id} />;

      case "collaborators":
        return (
          <CollaboratorsView
            projectId={project.id}
            onCreateTask={handleCreateTask}
            toggleBulk={toggleCollaboratorSelection}
            selectedCollaboratorIds={selectedCollaboratorIds}
            onClearSelection={handleClearSelection}
          />
        );

      case "workload":
        return <WorkloadView projectId={project.id} />;

      case "comments":
        return <CommentsView projectId={project.id} />;
    }
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6">
        <ProjectDetailsHeader
          project={project}
          onOpen={() => setIsInviteOpen(true)}
        />
      </div>

      <div>
        <ProjectTabs activeTab={activeTab} onChange={navigateTab} />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <TabViewResult />
      </div>

      <AddTaskPanel
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={projectId}
        teamUserIds={project.invitedUserIds}
        initialCollaboratorIds={selectedCollaboratorIds}
      />

      {isInviteOpen && (
        <InviteUserModal
          onClose={() => setIsInviteOpen(false)}
          onInviteOpen={isInviteOpen}
          teamUserIds={project.invitedUserIds}
          invitedUserIds={project.invitedUserIds}
          projectId={projectId}
        />
      )}
    </div>
  );
};
export default ProjectDetailsPage;

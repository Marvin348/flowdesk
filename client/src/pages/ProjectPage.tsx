import { useParams, useSearchParams } from "react-router";
import ProjectDetailsHeader from "@/components/pages/projectDetailsPage/details/ProjectDetailsHeader";
import { useProjectDetailsVM } from "@/domain/projects/useProjectDetails";
import { getProgressResult } from "@/utils/getProgressResult";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import ProjectTabs from "@/components/pages/projectDetailsPage/details/tabs/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/components/pages/projectDetailsPage/details/views/attachmentsView/AttachmentsView";
import ListView from "@/components/pages/projectDetailsPage/details/views/listView/ListView";
import Overview from "@/components/pages/projectDetailsPage/details/views/overview/Overview";
import CollaboratorsView from "@/components/pages/projectDetailsPage/details/views/collaboratorsView/CollaboratorsView";
import AddTaskPanel from "@/components/tasks/create/AddTaskPanel";
import InviteUserModal from "@/components/collaborators/InviteUserModal";
import WorkloadTable from "@/components/pages/projectDetailsPage/details/views/overview/workload/WorkloadTable";
import { getProjectUserWorkload } from "@/utils/workload/getProjectUserWorkload";
import CommentsView from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentsView";
import { Spinner } from "@/components/ui/spinner";

export type ActiveTab =
  | "overview"
  | "list"
  | "files"
  | "collaborators"
  | "workload"
  | "comments";

const ProjectPage = () => {
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

  if (isLoading) return <Spinner />;
  if (error) return <div>Something went wrong</div>;
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

  console.log("project", project);

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
export default ProjectPage;

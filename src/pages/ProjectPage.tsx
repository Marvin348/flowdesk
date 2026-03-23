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
import { getUserWorkload } from "@/utils/workload/getUserWorkload";
import CommentsView from "@/components/pages/projectDetailsPage/details/views/commentsView/CommentsView";

export type ActiveTab =
  | "overview"
  | "list"
  | "files"
  | "collaborators"
  | "workload"
  | "comments";

const ProjectPage = () => {
  const [searchParams, setSeatchParams] = useSearchParams();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const activeTab = (searchParams.get("tab") as ActiveTab) ?? "overview";

  const navigateTab = (tab: ActiveTab) => setSeatchParams({ tab });

  const { id } = useParams();
  const projectId = id ?? "";

  const projectDetailsVM = useProjectDetailsVM(projectId);

  const project = projectDetailsVM.find((project) => project.id === id);

  const teamUsers = useUsersByIds(project?.teamUserIds ?? []);

  if (!project) return <div>Projekt nicht gefunden</div>;

  const workloadStats = getUserWorkload(project.tasks);
  const progress = getProgressResult(project.tasks);

  const attachments = project.tasks.flatMap((t) => t.attachments);

  const TabViewResult = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            project={project}
            progress={progress}
            collaborator={teamUsers}
            onOpen={() => setIsAddTaskOpen(true)}
            inviteOpen={() => setIsInviteOpen(true)}
            onNavigate={navigateTab}
          />
        );

      case "files":
        return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView tasks={project.tasks} />;

      case "collaborators":
        return <CollaboratorsView collaborator={teamUsers} />;

      case "workload":
        return <WorkloadTable stats={workloadStats} variant="full" />;

      case "comments":
        return <CommentsView tasks={project.tasks} />;
    }
  };

  console.log("project", project);

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

      <section className="mt-6">
        <TabViewResult />
      </section>

      <AddTaskPanel
        onOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={projectId}
        teamUserIds={project.teamUserIds ?? []}
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

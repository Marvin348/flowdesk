import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectDetailsVM } from "@/domain/projects/useProjectDetails";
import { getProgressResult } from "@/utils/getProgressResult";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import ProjectTabs from "@/components/projects/details/tabs/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/components/projects/details/views/attachmentsView/AttachmentsView";
import ListView from "@/components/projects/details/views/listView/ListView";
import Overview from "@/components/projects/details/views/overview/Overview";
import CollaboratorsView from "@/components/projects/details/views/collaboratorsView/CollaboratorsView";
import AddTaskPanel from "@/components/tasks/create/AddTaskPanel";

export type ActiveTab =
  | "overview"
  | "list"
  | "files"
  | "collaborators"
  | "settings";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { id } = useParams();
  const projectId = id ?? "";
  
  const projectDetailsVM = useProjectDetailsVM(projectId);
  
  const project = projectDetailsVM.find((project) => project.id === id);

  const teamUsers = useUsersByIds(project?.teamUserIds ?? []);

  if (!project) return [];

  const progress = getProgressResult(project.tasks);

  const attachments = project.tasks.flatMap((t) => t.attachments);
  console.log(attachments);

  const onClick = (value: ActiveTab) => setActiveTab(value);

  const TabViewResult = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            project={project}
            progress={progress}
            collaborator={teamUsers}
            onOpen={() => setIsAddTaskOpen(true)}
          />
        );

      case "files":
        return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView tasks={project.tasks} />;

      case "collaborators":
        return <CollaboratorsView collaborator={teamUsers} />;
    }
  };

  console.log("teamUsers", teamUsers);
  console.log("projectTasks", project.tasks);
  console.log("project", project);

  return (
    <>
      <div className="mb-6">
        <ProjectDetailsHeader project={project} progress={progress} />
      </div>

      <div>
        <ProjectTabs activeTab={activeTab} onChange={onClick} />
      </div>

      <div className="mt-6">
        <TabViewResult />
      </div>

      <AddTaskPanel
        onOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={projectId}
      />
    </>
  );
};
export default ProjectPage;

import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import { getProgressResult } from "@/utils/getProgressResult";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import ProjectTabs from "@/components/projects/details/tabs/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/components/projects/details/views/attachmentsView/AttachmentsView";
import ListView from "@/components/projects/details/views/listView/ListView";
import Overview from "@/components/projects/details/views/overview/Overview";
import CollaboratorsView from "@/components/projects/details/views/collaboratorsView/CollaboratorsView";

export type ActiveTab =
  | "overview"
  | "list"
  | "files"
  | "collaborators"
  | "settings";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const { id } = useParams();

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  const teamUsers = useUsersByIds(project?.teamUserIds ?? []);

  if (!project) return [];

  const progress = getProgressResult(project.tasks);

  const attachments = project.tasks.flatMap((t) => t.attachments);
  console.log(attachments);

  const onClick = (value: ActiveTab) => setActiveTab(value);

  const TabViewResult = () => {
    switch (activeTab) {
      case "overview":
        return <Overview project={project} progress={progress} collaborator={teamUsers}/>;

      case "files":
        return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView tasks={project.tasks} />;

      case "collaborators":
        return <CollaboratorsView collaborator={teamUsers}/>;
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
    </>
  );
};
export default ProjectPage;

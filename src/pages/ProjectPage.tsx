import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import { getProgressResult } from "@/utils/getProgressResult";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";
import CommentsList from "@/components/projects/details/comments/CommentsList";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import ProjectTabs from "@/components/projects/details/tabs/ProjectTabs";
import { useState } from "react";
import AttachmentsView from "@/components/projects/details/views/attachmentsView/AttachmentsView";
import ListView from "@/components/projects/details/views/listView/ListView";
import Overview from "@/components/projects/details/views/overview/Overview";

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

  if (!project) return null;

  const progress = getProgressResult(project.tasks);

  const attachments = project.tasks.flatMap((t) => t.attachments);
  console.log(attachments);

  const onClick = (value: ActiveTab) => setActiveTab(value);

  const TabResult = () => {
    switch (activeTab) {
      case "overview":
        return <Overview project={project} progress={progress} />;

      case "files":
        return <AttachmentsView attachments={attachments} />;

      case "list":
        return <ListView tasks={project.tasks} />;
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
        <TabResult />
      </div>
    </>
  );
};
export default ProjectPage;

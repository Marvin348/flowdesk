import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";
import ProgressBar from "@/components/projects/card/ProgressBar";
import { getProgressResult } from "@/utils/getProgressResult";
import ProgressBarCard from "@/components/projects/details/ProgressBarCard";

const ProjectPage = () => {
  const { id } = useParams();

  if (!id) return;

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  if (!project) return;

  const progress = getProgressResult(project.taskIds, project.tasks);

  console.log(project);
  console.log(id);
  return (
    <>
      <div>
        <ProjectDetailsHeader project={project} />
      </div>

      <div>
        <CollaboratorsList users={project.users} />
      </div>

      <div>
        <OpenTaskList tasks={project.tasks} users={project.users} />
      </div>

      <div>
        <ProgressBarCard progress={progress}/>
      </div>
    </>
  );
};
export default ProjectPage;

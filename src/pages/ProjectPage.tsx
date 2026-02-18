import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";
import CollaboratorsList from "@/components/projects/details/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/projects/details/tasks/OpenTaskList";

const ProjectPage = () => {
  const { id } = useParams();

  if (!id) return;

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  if (!project) return;

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
        <OpenTaskList tasks={project.tasks} users={project.users}/>
      </div>
    </>
  );
};
export default ProjectPage;

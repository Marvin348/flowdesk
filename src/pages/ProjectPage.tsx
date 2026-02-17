import { useParams } from "react-router";
import ProjectDetailsHeader from "@/components/projects/details/ProjectDetailsHeader";
import { useProjectsWithMeta } from "@/hooks/useProjectsWithMeta";

const ProjectPage = () => {
  const { id } = useParams();

  if (!id) return;

  const projectsWithMeta = useProjectsWithMeta();
  const project = projectsWithMeta.find((project) => project.id === id);

  if (!project) return;

  console.log(project);
  console.log(id);
  return (
    <div>
      <ProjectDetailsHeader project={project} />
    </div>
  );
};
export default ProjectPage;

import ProjectCard from "@/components/projects/card/ProjectCard";
import { useNavigate } from "react-router";
import type { ProjectsList } from "@/type/projectsList";
type ProjectListType = {
  projects: ProjectsList[];
};

const ProjectList = ({ projects }: ProjectListType) => {
  const navigate = useNavigate();

  return (
    <>
      {projects.map((pro) => (
        <article
          key={pro.id}
          className="border rounded-md p-4 cursor-pointer"
          onClick={() => navigate(`/project/${pro.id}`)}
        >
          <ProjectCard project={pro} />
        </article>
      ))}
    </>
  );
};
export default ProjectList;

import ProjectCard from "@/features/projects/components/card/ProjectCard";
import { useNavigate } from "react-router";
import type { ProjectListVM } from "@/features/projects/types/projectsList";

type ProjectListProps = {
  projects: ProjectListVM[];
};

const ProjectList = ({ projects }: ProjectListProps) => {
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

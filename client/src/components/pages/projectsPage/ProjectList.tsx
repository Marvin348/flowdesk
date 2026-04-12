import ProjectCard from "@/components/pages/projectsPage/card/ProjectCard";
import { useNavigate } from "react-router";
import type { ProjectListVM } from "@/type/view-models/projectsList";

type ProjectListType = {
  projects: ProjectListVM[];
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

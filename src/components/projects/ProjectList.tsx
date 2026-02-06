import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import ProjectCard from "./card/ProjectCard";

type ProjectListType = {
  projects: ProjectsWithMeta[];
};

const ProjectList = ({ projects }: ProjectListType) => {
  return (
    <>
      {projects.map((pro) => (
        <div key={pro.id} className="border rounded-md p-4">
          <ProjectCard project={pro} />
        </div>
      ))}
    </>
  );
};
export default ProjectList;

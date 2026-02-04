import type { ProjectsWithMeta } from "@/type/projectsWithMeta";

type ProjectCardType = {
  project: ProjectsWithMeta;
};

const ProjectCard = ({ project }: ProjectCardType) => {
  const {
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    createdAt,
    comments,
    users,
    tasks,
    attachments,
  } = project;
  return (
    <>
      <h3>{title}</h3>
      <p>{status}</p>
    </>
  );
};
export default ProjectCard;

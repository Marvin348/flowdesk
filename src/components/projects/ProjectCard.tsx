import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { EllipsisVertical, Star } from "lucide-react";
import AssigneeAvatars from "./user/AssigneeAvatars";

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

  // später dropdown mit star feature
  return (
    <>
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-medium">{title}</h3>
        <button>
          <EllipsisVertical strokeWidth={1} fill="black" />
        </button>
      </div>
      <div>

        <div className="mt-4">
          <AssigneeAvatars users={users} />
        </div>

        <p>{status}</p>
        <p>{priority}</p>
      </div>
    </>
  );
};
export default ProjectCard;

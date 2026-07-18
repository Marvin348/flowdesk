import type { Project } from "@shared/types/project";
import type { Task } from "@shared/types/task";
import type { Attachment } from "@shared/types/attachment";
import type { User } from "@shared/types/user";


export type ProjectDetails = {
  project: Project;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  attachments: Attachment[];
};

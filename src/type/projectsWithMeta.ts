import type { Project } from "@/type/project";
import type { Comments } from "@/type/comments";
import type { User } from "@/type/user";
import type { Task } from "@/type/task";
import type { Attachment } from "@/type/attachment";

export type ProjectsWithMeta = Project & {
  comments: Comments[];
  users: User[];
  tasks: Task[];
  attachments: Attachment[];
};

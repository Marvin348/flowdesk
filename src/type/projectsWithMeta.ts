import type { Project } from "@/type/Project";
import type { Comments } from "@/type/comments";
import type { User } from "@/type/user";
import type { Task } from "@/type/subtask";
import type { Attachment } from "@/type/attachment";

export type ProjectsWithMeta = Project & {
  comments: Comments;
  users: User;
  tasks: Task;
  attachments: Attachment;
};

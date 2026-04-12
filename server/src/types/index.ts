import type { Project } from "../../../shared/types/project.js";
import type { Task } from "../../../shared/types/task.js";
import type { Comment } from "../../../shared/types/comment.js";
import type { Attachment } from "../../../shared/types/attachment.js";
import type { User } from "../../../shared/types/user.js";

export type Database = {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  attachments: Attachment[];
  users: User[];
};

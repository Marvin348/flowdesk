import type { Project } from "@shared/types/project";
import type { Task } from "@shared/types/task";
import type { Comment } from "@shared/types/comment";
import type { Attachment } from "@shared/types/attachment";
import type { User } from "@shared/types/user";

export type Database = {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  attachments: Attachment[];
  users: User[];
};

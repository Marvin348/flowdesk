import type { Project } from "@/type/domain/project";
import type { Badge } from "@/store/slices/projectBadge";
import type { TaskWithMeta } from "./taskWithMeta";
import type { Task } from "../domain/task";
import type { Attachment } from "../domain/attachment";
import type { User } from "../domain/user";

export type ProjectsWithMeta = Project & {
  tasks: TaskWithMeta[];

  meta: {
    taskCount: number;
    commentCount: number;
    attachmentCount: number;
    userCount: number;
  };

  teamUserIds: string[];

  badge?: Badge;
};

export type ProjectDetails = {
  project: Project;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  attachments: Attachment[];
};

export type ProjectDetailsVM = {
  project: ProjectsWithMeta | null;
  isLoading: boolean;
  error: Error | null;
};

import type { Project } from "@shared/types/project";
import type { Badge } from "@/store/slices/projectBadge";
import type { TaskWithMeta } from "@/features/tasks/types/taskWithMeta";
import type { Task } from "@shared/types/task";
import type { Attachment } from "@shared/types/attachment";
import type { User } from "@shared/types/user";

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

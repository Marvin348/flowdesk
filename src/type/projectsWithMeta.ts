import type { Project } from "@/type/project";
import type { Badge } from "@/store/slices/projectBadge";
import type { TaskWithMeta } from "./taskWithMeta";

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

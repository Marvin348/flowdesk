import type { Progress } from "@/utils/getProgressResult";
import type { Project } from "../domain/project";
import type { Badge } from "@/store/slices/projectBadge";

export type ProjectsList = Project & {
  badge?: Badge;

  meta: {
    taskCount: number;
    commentCount: number;
    attachmentCount: number;
    completedTaskCount: number;
    userCount: number;
  };
  progress: Progress;

  teamUserIds: string[];
};

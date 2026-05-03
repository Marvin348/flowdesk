import type { Progress } from "@/shared/utils/getProgressResult";
import type { Badge } from "@/store/slices/projectBadge";
import type { Priority } from "@shared/types/priority";
import type { StatusBase } from "@shared/types/StatusBase";
import type { ProjectSummariesDto } from "@shared/types/dto/project";

export type ProjectListVM = ProjectSummariesDto & {
  badge?: Badge;
  progress: Progress;
};

export type ProjectSummaryDto = {
  id: string;
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  teamUserIds: string[];
  createdAt: string;

  stats: {
    taskCount: number;
    commentCount: number;
    attachmentCount: number;
    completedTaskCount: number;
    userCount: number;
  };
};

export type ProjectsListVM = {
  projects: ProjectListVM[];
  isLoading: boolean;
  error: Error | null;
};

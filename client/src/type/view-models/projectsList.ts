import type { Progress } from "@/utils/getProgressResult";
import type { Badge } from "@/store/slices/projectBadge";
import type { Priority } from "@shared/types/priority";
import type { StatusBase } from "@shared/types/StatusBase";

export type ProjectListVM = {
  id: string;
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  teamUserIds: string[];
  dueDate: string;
  createdAt: string;

  badge?: Badge;

  stats: {
    taskCount: number;
    completedTaskCount: number;
    commentCount: number;
    attachmentCount: number;
    userCount: number;
  };

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

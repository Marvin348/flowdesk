import type { Task } from "../../task.js";
import type { UserWorkload } from "../workload/projectUserWorkload.js";
import type { Progress } from "../common/progress.dto.js";
import type {UserPreviewDto} from "../common/userPreview.dto.js";

export type OverviewTaskDto = {
  id: string;
  title: string;
  dueDate: string;
  taskStatus: Task["taskStatus"];
  description?: Task["description"];
  collaborators: UserPreviewDto[];
};

export type OverviewCommentDto = {
  id: string;
  message: string;
  createdAt: string;
  user: UserPreviewDto | null;
};

export type ProjectOverviewDto = {
  collaborators: UserPreviewDto[];
  openTasks: OverviewTaskDto[];
  recentComments: OverviewCommentDto[];
  progress: Progress;
  workload: UserWorkload[];
};

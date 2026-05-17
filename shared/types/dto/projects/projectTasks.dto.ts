import type { Priority } from "../../priority.js";
import type { StatusBase } from "../../StatusBase.js";
import type { UserAvatarDto } from "../../dto/common/userPreview.dto.js";
import type { TaskStatsDto } from "../common/taskStats.dto.js";

export type ProjectTaskDto = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  taskPriority: Priority;
  collaborators: UserAvatarDto[];
  description?: string;
  tags?: string[];
  reminderAt?: string;
  completedAt?: string;
};

export type ProjectTasksResponseDto = {
  tasks: ProjectTaskDto[];
  taskStats: TaskStatsDto;
};

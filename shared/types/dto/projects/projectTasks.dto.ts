import type { Priority } from "../../Priority.js";
import type { StatusBase } from "../../StatusBase.js";
import type { UserAvatarDto } from "../../dto/common/userPreview.dto.js";

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
  pending: {
    tasks: ProjectTaskDto[];
    total: number;
    hasMore: boolean;
  };

  in_progress: {
    tasks: ProjectTaskDto[];
    total: number;
    hasMore: boolean;
  };

  done: {
    tasks: ProjectTaskDto[];
    total: number;
    hasMore: boolean;
  };
};

export type ProjectTasksByStatus = ProjectTaskDto;

import type { Priority } from "../../priority.js";
import type { StatusBase } from "../../StatusBase.js";
import type { UserPreviewDto } from "../../dto/common/userPreview.dto.js";

export type ProjectTaskDto = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  taskPriority: Priority;
  collaborators: UserPreviewDto[];
  description?: string;
  tags?: string[];
  reminderAt?: string;
  completedAt?: string;
};

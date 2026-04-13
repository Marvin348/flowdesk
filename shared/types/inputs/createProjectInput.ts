import type { Priority } from "../priority.js";
import type { StatusBase } from "../StatusBase.js";

export type CreateProjectInput = {
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  invitedUserIds: string[];
  description?: string;
};

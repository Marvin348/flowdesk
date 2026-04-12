import type { Priority } from "../priority";
import type { StatusBase } from "../statusBase";

export type CreateProjectInput = {
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  invitedUserIds: string[];
  description?: string;
};

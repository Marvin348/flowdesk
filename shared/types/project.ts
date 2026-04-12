import type { Priority } from "./priority.js";
import type { StatusBase } from "./statusBase.js";

export type Project = {
  id: string;

  title: string;
  description?: string;

  priority: Priority;
  projectStatus: StatusBase;

  dueDate: string;
  invitedUserIds: string[];

  createdAt: string;
  updatedAt?: string;
};

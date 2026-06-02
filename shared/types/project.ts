import type { Priority } from "./priority.js";
import type { StatusBase } from "./StatusBase.js";

export type Project = {
  id: string;

  title: string;
  description?: string;
  ownerId: string;
  priority: Priority;
  projectStatus: StatusBase;

  dueDate: string;
  invitedUserIds: string[];

  createdAt: string;
  updatedAt?: string;
};

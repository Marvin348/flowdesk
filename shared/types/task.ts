import type { Priority } from "./priority.js";
import type { StatusBase } from "./StatusBase.js";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  collaboratorIds: string[];
  taskPriority: Priority;
  description?: string;
  tags?: string[];
  reminderAt?: string;
};

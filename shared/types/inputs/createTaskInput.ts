import { Priority } from "../priority.js";

export type CreateTaskInput = {
  projectId: string;
  title: string;
  collaboratorIds: string[];
  dueDate: string;
  tags?: string[];
  taskPriority: Priority;
  reminderAt?: string;
  description?: string;
};

import type { Priority } from "../../priority.js";

export type UpcomingTaskDto = {
  taskId: string;
  taskTitle: string;
  projectTitle?: string;
  priority: Priority;
  dueDate: string;
};

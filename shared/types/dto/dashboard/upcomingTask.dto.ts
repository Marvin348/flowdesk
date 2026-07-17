import type { Priority } from "../../Priority.js";

export type UpcomingTaskDto = {
  taskId: string;
  taskTitle: string;
  projectTitle?: string;
  priority: Priority;
  dueDate: string;
};

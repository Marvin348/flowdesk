import type { Priority } from "../Priority";

export type UpdateTaskInput = {
  taskId: string;

  values: {
    title?: string;
    collaboratorIds?: string[];
    dueDate?: string;
    tags?: string[];
    taskPriority?: Priority;
    reminderAt?: string;
    description?: string;
  };
};

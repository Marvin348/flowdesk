import type { StatusBase } from "@/type/StatusBase";
export type Task = {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  taskStatus: StatusBase;
  collaboratorIds: string[];
  description?: string;
  tags?: string;
  reminderAt?: string;
};

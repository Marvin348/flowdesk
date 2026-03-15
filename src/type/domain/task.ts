import type { StatusBase } from "@/type/domain/StatusBase";
export type Task = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  collaboratorIds: string[];
  description?: string;
  tags?: string;
  reminderAt?: string;
};

import type { StatusBase } from "@/type/domain/StatusBase";
import type { Priority } from "@/type/domain/priority";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  taskStatus: StatusBase;
  collaboratorIds: string[];
  taskPriority: Priority;
  description?: string;
  tags?: string;
  reminderAt?: string;
};
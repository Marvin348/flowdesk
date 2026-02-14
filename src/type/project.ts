import type { Priority } from "@/type/priority";
import type { TaskStatus } from "@/type/taskStatus";

export type Project = {
  id: string;

  title: string;
  description?: string;

  priority: Priority;
  status: TaskStatus;

  dueDate: string;
  assigneeIds: string[];

  taskIds: string[];
  commentIds: string[];
  attachmenetIds: string[];

  createdAt: string;
  updatedAt?: string;
};

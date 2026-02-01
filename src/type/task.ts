import type { Priority } from "@/type/priority";
import type { TaskStatus } from "@/type/taskStatus";

export type Task = {
  id: string;

  title: string;
  description?: string;

  priority: Priority;
  status: TaskStatus;

  dueDate?: string;
  assigneeIds: string[];

  subtaskIds: string[];
  commentIds: string[];
  attachmenetIds?: string[];

  createdAt: string;
  updatedAt?: string;
};

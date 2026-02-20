import type { Priority } from "@/type/priority";
import type { StatusBase } from "@/type/StatusBase";

export type Project = {
  id: string;

  title: string;
  description?: string;

  priority: Priority;
  projectStatus: StatusBase;

  dueDate: string;
  // assigneeIds: string[];

  // taskIds: string[];
  // commentIds: string[];
  // attachmenetIds: string[];

  createdAt: string;
  updatedAt?: string;
};

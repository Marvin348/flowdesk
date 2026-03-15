import type { Priority } from "@/type/domain/priority";
import type { StatusBase } from "@/type/domain/StatusBase";

export type Project = {
  id: string;

  title: string;
  description?: string;

  priority: Priority;
  projectStatus: StatusBase;

  dueDate: string;
  invitedUserIds: string[];

  createdAt: string;
  updatedAt?: string;
};

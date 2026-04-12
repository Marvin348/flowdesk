import type { Priority } from "@/type/domain/priority";
import type { StatusBase } from "@/type/domain/StatusBase";

export type CreateProjectInput = {
  title: string;
  priority: Priority;
  projectStatus: StatusBase;
  dueDate: string;
  invitedUserIds: string[];
  description?: string;
};

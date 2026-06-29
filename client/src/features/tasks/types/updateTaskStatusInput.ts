import type { StatusBase } from "@shared/types/StatusBase";

export type UpdateTaskStatusInput = {
  taskId: string;
  taskStatus: StatusBase;
};

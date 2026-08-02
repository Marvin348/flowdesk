import type { StatusBase } from "@shared/types/StatusBase";

export type ProjectTasksByTypeInput = {
  projectId: string;
  taskStatus: StatusBase;
  limit: number;
  offset: number;
};

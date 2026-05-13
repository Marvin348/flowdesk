import type { ProjectWorkloadSort } from "../sort/projectWorkloadSort.js";

export type ProjectWorkloadInput = {
  projectId: string;
  page: number;
  limit: number;
  sort?: ProjectWorkloadSort;
};

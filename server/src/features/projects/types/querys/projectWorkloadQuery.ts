import type { ProjectWorkloadSort } from "@shared/types/sort/projectWorkloadSort.js";

export type ProjectWorkloadQuery = {
  page?: string;
  limit?: string;
  workloadSort?: ProjectWorkloadSort;
};

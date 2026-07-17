import type { ProjectWorkloadSort } from "@shared/types/sort/projectWorkloadSort";

export type ProjectWorkloadQuery = {
  page?: string;
  limit?: string;
  workloadSort?: ProjectWorkloadSort;
};

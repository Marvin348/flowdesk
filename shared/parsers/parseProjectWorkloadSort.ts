import type { ProjectWorkloadSort } from "../types/sort/projectWorkloadSort.js";

export const parseProjectWorkloadSort = (
  value?: string | null,
): ProjectWorkloadSort | undefined =>
  value === "name_asc" ||
  value === "name_desc" ||
  value === "totalTasks_asc" ||
  value === "totalTasks_desc" ||
  value === "openTasks_asc" ||
  value === "openTasks_desc" ||
  value === "progressStatus_asc" ||
  value === "progressStatus_desc"
    ? value
    : undefined;

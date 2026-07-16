export type ProjectWorkloadSort = (typeof PROJECT_WORKLOAD_SORT)[number];

export const PROJECT_WORKLOAD_SORT = [
  "name_asc",
  "name_desc",
  "totalTasks_asc",
  "totalTasks_desc",
  "openTasks_asc",
  "openTasks_desc",
  "progressStatus_asc",
  "progressStatus_desc",
]as const;

import { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload.js";
import { ProjectWorkloadSort } from "@shared/types/sort/projectWorkloadSort.js";

export const sortedWorkload = (
  workload: UserWorkload[],
  sort?: ProjectWorkloadSort,
) => {
  if (!sort) return workload;

  return [...workload].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.user.name.localeCompare(b.user.name);

      case "name_desc":
        return b.user.name.localeCompare(a.user.name);

      case "totalTasks_asc":
        return a.totalTasks - b.totalTasks;

      case "totalTasks_desc":
        return b.totalTasks - a.totalTasks;

      case "openTasks_asc":
        return a.openCount - b.openCount;

      case "openTasks_desc":
        return b.openCount - a.openCount;

      case "progressStatus_asc":
        return a.progressPercent - b.progressPercent;

      case "progressStatus_desc":
        return b.progressPercent - a.progressPercent;
    }
  });
};

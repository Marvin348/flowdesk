import type { UserWorkload } from "@/utils/workload/getUserWorkload";
import type { SortedBy } from "@/components/pages/projectDetailsPage/details/views/overview/workload/WorkloadTable";

export const getSortedWorkloadStats = (
  userWorkload: UserWorkload[],
  sortedBy: SortedBy | null,
) => {
  if (!sortedBy) return userWorkload;

  return [...userWorkload].sort((a, b) => {
    let result = 0;

    if (sortedBy.sortKey === "name") {
      result = a.user.name.localeCompare(b.user.name);
    } else if (sortedBy.sortKey === "open") {
      result = a.openCount - b.openCount;
    } else if (sortedBy.sortKey === "status") {
      result = a.progressPercent - b.progressPercent;
    } else if (sortedBy.sortKey === "total") {
      result = a.totalTasks - b.totalTasks;
    }

    return sortedBy.sortDirection === "asc" ? result : -result;
  });
};

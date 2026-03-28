import type { SortedByList } from "@/components/pages/projectDetailsPage/details/views/listView/ListView";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";

export const getSortedList = (
  taskWithMeta: TaskWithMeta[],
  sortedBy: SortedByList | null,
) => {
  if (!sortedBy) return taskWithMeta;

  return [...taskWithMeta].sort((a, b) => {
    let result = 0;

    if (sortedBy.sortKey === "task") {
      result = a.title.localeCompare(b.title);

    } else if (sortedBy.sortKey === "dueDate") {
      result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    } else if (sortedBy.sortKey === "assignee") {
      const aCollaborator = a.collaborators[0].name;
      const bCollaborator = b.collaborators[0].name;

      result = aCollaborator.localeCompare(bCollaborator);
      
    } else if (sortedBy.sortKey === "priority") {
      const priorityRank = {
        high: 3,
        medium: 2,
        low: 1,
      };

      const aRank = priorityRank[a.taskPriority];
      const bRank = priorityRank[b.taskPriority];

      result = bRank - aRank;
    }
    return sortedBy.sortDirection === "asc" ? result : -result;
  });
};

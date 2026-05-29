import { PRIORITY, type Priority } from "@shared/types/priority.js";
import type { TaskPriorityItemDto } from "@shared/types/dto/dashboard/taskPriorityItem.dto.js";

export const mapTaskPriorityItems = (
  priorityCounts: Partial<Record<Priority, number>>,
): TaskPriorityItemDto[] => {
  return PRIORITY.map((prio) => {
    return {
      priority: prio,
      count: priorityCounts[prio] ?? 0,
    };
  });
};

import type { Task } from "@shared/types/task.js";
import { PRIORITY } from "@shared/types/priority.js";
import type { TaskPriorityItemDto } from "@shared/types/dto/dashboard/taskPriorityItem.dto.js";

export const mapTaskPriorityItems = (tasks: Task[]): TaskPriorityItemDto[] => {
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc.priorityCounts[task.taskPriority] += 1;

      return acc;
    },
    {
      priorityCounts: {
        low: 0,
        medium: 0,
        high: 0,
      },
    },
  );

  return PRIORITY.map((prio) => {
    return {
      priority: prio,
      count: priorityCounts.priorityCounts[prio] ?? 0,
    };
  });
};

import type { Task } from "@shared/types/task";
import { PRIORITY_OPTIONS } from "@/constants/priority-options";
import type { Priority } from "@shared/types/priority";

export type TaskPriorityCounts = {
  low: number;
  medium: number;
  high: number;
};

export type TaskPriorityItem = {
  id: Priority;
  value: Priority;
  label: string;
  count: number;
  color: string;
};

export const getTaskPriorityItems = (tasks: Task[]) => {
  const counts = tasks.reduce(
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

  const result = Object.entries(PRIORITY_OPTIONS).map(([key, config]) => {
    return {
      ...config,
      id: config.value,
      count: counts.priorityCounts[key as keyof TaskPriorityCounts],
    };
  });

  return result;
};

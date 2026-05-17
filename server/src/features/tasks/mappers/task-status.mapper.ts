import { calcPercent } from "@/shared/utils/calcPercent.js";
import { Task } from "@shared/types/task.js";
import type { TaskStatsDto } from "@shared/types/dto/common/taskStats.dto.js";

export const toTaskStatsDto = (tasks: Task[]): TaskStatsDto => {
  const totalCount = tasks.length;

  const counts = tasks.reduce(
    (acc, task) => {
      acc[task.taskStatus] += 1;
      return acc;
    },
    {
      pending: 0,
      in_progress: 0,
      done: 0,
    },
  );

  return {
    pending: {
      count: counts.pending,
      percent: calcPercent(counts.pending, totalCount),
    },
    in_progress: {
      count: counts.in_progress,
      percent: calcPercent(counts.in_progress, totalCount),
    },
    done: {
      count: counts.done,
      percent: calcPercent(counts.done, totalCount),
    },
  };
};

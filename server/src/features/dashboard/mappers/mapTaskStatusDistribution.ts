import type { Task } from "@shared/types/task.js";
import { calcPercent } from "@shared/utils/calcPercent.js";
import type { TaskStatusDistributionDto } from "@shared/types/dto/dashboard/taskStatusDistribution.dto.js";

export const mapTaskStatusDistribution = (
  tasks: Task[],
): TaskStatusDistributionDto => {
  const stats = tasks.reduce(
    (acc, task) => {
      acc.byStatusCounts[task.taskStatus] += 1;

      return acc;
    },
    {
      byStatusCounts: {
        pending: 0,
        in_progress: 0,
        done: 0,
      },
    },
  );

  const totalTasks = tasks.length;

  return {
    pending: calcPercent(stats.byStatusCounts.pending, totalTasks),
    in_progress: calcPercent(stats.byStatusCounts.in_progress, totalTasks),
    done: calcPercent(stats.byStatusCounts.done, totalTasks),
  };
};

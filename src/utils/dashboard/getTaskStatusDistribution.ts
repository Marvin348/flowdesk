import type { Task } from "@/type/domain/task";
import { calcPercent } from "@/utils/calcPercent";

export type TaskStatusDistribution = {
  pending: number;
  in_progress: number;
  done: number;
};

export const getTaskStatusDistribution = (tasks: Task[]) => {
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

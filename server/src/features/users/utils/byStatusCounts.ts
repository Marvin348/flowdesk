import { Task } from "@shared/types/task.js";

export const byStatusCounts = (tasks: Task[]) =>
  tasks.reduce(
    (acc, task) => {
      if (task.taskStatus === "done") {
        acc.completedCount += 1;
      }

      acc.byStatusCounts[task.taskStatus] += 1;

      return acc;
    },
    {
      completedCount: 0,
      byStatusCounts: {
        pending: 0,
        in_progress: 0,
        done: 0,
      },
    },
  );

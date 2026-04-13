import { calcPercent } from "@/utils/calcPercent";
import type { TaskWithMeta } from "@/type/view-models/taskWithMeta";

export type Progress = ReturnType<typeof getProgressResult>;

export const getProgressResult = (tasks: TaskWithMeta[]) => {
  const total = tasks.length;

  const result = tasks.reduce(
    (acc, task) => {
      if (task.taskStatus === "done") {
        acc.completed += 1;
      }

      return acc;
    },
    {
      completed: 0,
      percent: 0,
      total: 0,
    },
  );

  result.total = total;
  result.percent = calcPercent(result.completed, result.total);

  return result;
};

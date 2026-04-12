import type { Task } from "@/type/domain/task";
import { calcPercent } from "@/utils/calcPercent";

export type Progress = ReturnType<typeof getProgressResult>;

export const getProgressResult = (tasks: Task[]) => {
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

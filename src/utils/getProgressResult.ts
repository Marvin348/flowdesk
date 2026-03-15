import type { Task } from "@/type/domain/task";

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
  result.percent = total ? Math.round((result.completed / total) * 100) : 0;

  return result;
};

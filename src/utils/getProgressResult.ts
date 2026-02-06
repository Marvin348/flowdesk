import type { Task } from "@/type/task";

export const getProgressResult = (taskIds: string[], tasks: Task[]) => {
  const total = taskIds.length;

  const result = tasks.reduce(
    (acc, task) => {
      acc.total = total;

      if (task.completed) {
        acc.completed += 1;
      }

      return acc;
    },
    {
      total: 0,
      completed: 0,
      percent: 0,
    },
  );
  result.percent = total ? Math.round((result.completed / result.total) * 100) : 0;

  return result;
};

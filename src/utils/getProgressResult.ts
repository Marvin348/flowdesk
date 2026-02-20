import type { Task } from "@/type/task";
import type { TaskWithMeta } from "@/type/taskWithMeta";

export const getProgressResult = (taskIds: TaskWithMeta[], tasks: Task[]) => {
  const result = tasks.reduce(
    (acc, task) => {
      if (task.completed) {
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

  const total = taskIds.length;

  result.total = total;
  result.percent = total ? Math.round((result.completed / total) * 100) : 0;

  return result;
};

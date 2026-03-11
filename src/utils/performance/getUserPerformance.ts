import type { Task } from "@/type/task";
import type { User } from "@/type/user";

export type UserPerformance = User & {
  stats: {
    completedCount: number;
    openTasks: number;
    progressPercent: number;
    tasksCount: number;
  };
};

export const getUserPerformance = (
  users: User[],
  tasks: Task[],
): UserPerformance[] => {
  const derivedUser = users.map((u) => {
    const matchesTasks = tasks.filter((task) =>
      task.collaboratorIds.includes(u.id),
    );

    const workload = matchesTasks.reduce(
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

    const openTasks =
      workload.byStatusCounts.pending + workload.byStatusCounts.in_progress;

    const progressPercent = matchesTasks.length
      ? Math.round((workload.byStatusCounts.done / matchesTasks.length) * 100)
      : 0;

    const stats = {
      tasksCount: matchesTasks.length,
      openTasks,
      progressPercent,
      completedCount: workload.completedCount,
    };

    return {
      ...u,
      stats,
    };
  });

  return derivedUser;
};

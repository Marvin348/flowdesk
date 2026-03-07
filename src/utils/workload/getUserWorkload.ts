import type { TaskWithMeta } from "@/type/taskWithMeta";
import type { User } from "@/type/user";

export type UserWorkloadStats = {
  totalTasks: number;
  user: User;
  byStatusCounts: { pending: number; in_progress: number; done: number };
};

export type UserWorkload = UserWorkloadStats & {
  openCount: number;
  progressPercent: number;
};

export const getUserWorkload = (tasks: TaskWithMeta[]) => {
  const statsByUserId = tasks.reduce<Record<string, UserWorkloadStats>>(
    (acc, task) => {
      for (const collaborator of task.collaborators) {
        const userId = collaborator.id;

        if (!acc[userId]) {
          acc[userId] = {
            totalTasks: 0,
            user: collaborator,
            byStatusCounts: {
              pending: 0,
              in_progress: 0,
              done: 0,
            },
          };
        }

        acc[userId].totalTasks++;
        acc[userId].byStatusCounts[task.taskStatus] += 1;
      }

      return acc;
    },
    {},
  );

  const getWorkloadStats = Object.values(statsByUserId).map((stats) => {
    const openCount =
      stats.byStatusCounts.pending + stats.byStatusCounts.in_progress;

    const progressPercent = stats.totalTasks
      ? Math.round((stats.byStatusCounts.done / stats.totalTasks) * 100)
      : 0;

    return {
      ...stats,
      openCount,
      progressPercent,
    };
  });

  return getWorkloadStats;
};

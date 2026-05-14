import { Task } from "@shared/types/task.js";
import { calcPercent } from "@/shared/utils/calcPercent.js";
import { User } from "@shared/types/user.js";
import type {
  UserWorkload,
  UserWorkloadStats,
} from "@shared/types/dto/workload/projectUserWorkload.js";

export const getProjectUserWorkload = (
  tasks: Task[],
  usersById: Map<string, User>,
): UserWorkload[] => {
  const statsByUserId = tasks.reduce<Record<string, UserWorkloadStats>>(
    (acc, task) => {
      for (const collaboratorId of task.collaboratorIds) {
        const userId = collaboratorId;
        const user = usersById.get(collaboratorId);

        if (!user) continue;

        if (!acc[userId]) {
          acc[userId] = {
            totalTasks: 0,
            user: {
              id: user.id,
              name: user.name,
              avatarKey: user.avatarKey,
            },
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

    const progressPercent = calcPercent(
      stats.byStatusCounts.done,
      stats.totalTasks,
    );

    return {
      ...stats,
      openCount,
      progressPercent,
    };
  });

  return getWorkloadStats;
};

import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import { calcPercent } from "@/utils/calcPercent.js";
import type { TeamMemberDto } from "@shared/types/dto/user.js";

export const getUserPerformance = (
  users: User[],
  tasks: Task[],
): TeamMemberDto[] => {
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

    const progressPercent = calcPercent(
      workload.byStatusCounts.done,
      matchesTasks.length,
    );

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

import type { Task } from "@shared/types/task.js";
import type { User } from "@shared/types/user.js";
import { calcPercent } from "@shared/utils/calcPercent.js";
import { UserPreviewDto } from "@shared/types/dto/common/userPreview.dto.js";

export type UserPerformanceDto = {
  user: UserPreviewDto;
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
) => {
  return users.map((u) => {
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
      user: {
        id: u.id,
        name: u.name,
        avatarKey: u.avatarKey,
        avatarUrl: u.avatarUrl,
        jobTitle: u.jobTitle,
      },
      stats,
    };
  });
};

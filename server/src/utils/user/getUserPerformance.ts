import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import { calcPercent } from "@/utils/calcPercent.js";
import { TeamMemberDto } from "@shared/types/dto/user.js";
import { byStatusCounts } from "@/utils/user/byStatusCounts.js";

export const getUserPerformance = (
  user: User,
  tasks: Task[],
): TeamMemberDto => {
  const matchesTasks = tasks.filter((task) =>
    task.collaboratorIds.includes(user.id),
  );

  const workload = byStatusCounts(matchesTasks);

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
    ...user,
    stats,
  };
};

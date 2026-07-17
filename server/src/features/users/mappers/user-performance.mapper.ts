import { Task } from "@shared/types/task";
import { User } from "@shared/types/user";
import { calcPercent } from "@/shared/utils/calcPercent";
import { TeamMemberDto } from "@shared/types/dto/users/user";
import { byStatusCounts } from "@/features/users/utils/byStatusCounts";

export const toUserPerformanceDto = (
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

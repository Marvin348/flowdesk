import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import { byStatusCounts } from "@/utils/user/byStatusCounts.js";
import type { NextDueTaskDto, UserDetailsDto } from "@shared/types/dto/user.js";
import type { RecentCompletedTaskDto } from "@shared/types/dto/user.js";

export const getUserDetails = (
  user: User,
  projects: Project[],
  tasks: Task[],
): UserDetailsDto => {
  const invitedProjects = projects
    .filter((p) => p.invitedUserIds.includes(user.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      priority: p.priority,
      projectStatus: p.projectStatus,
    }));

  const matchedTasks = tasks.filter((t) => t.collaboratorIds.includes(user.id));

  const statusCounts = byStatusCounts(matchedTasks);

  const isCompletedTask = (
    task: Task,
  ): task is Task & { completedAt: string } =>
    task.taskStatus === "done" && typeof task.completedAt === "string";

  const recentCompletedTask = matchedTasks
    .filter(isCompletedTask)
    .reduce<(Task & { completedAt: string }) | null>((latest, task) => {
      if (!latest) return task;
      return new Date(task.completedAt) > new Date(latest.completedAt)
        ? task
        : latest;
    }, null);

  const nextDueTask = matchedTasks.reduce<Task | null>((acc, next) => {
    if (!acc) return next;
    return new Date(next.dueDate) > new Date(acc.dueDate) ? next : acc;
  }, null);

  const nextDueTaskDto: NextDueTaskDto | null = nextDueTask
    ? {
        id: nextDueTask.id,
        title: nextDueTask.title,
        dueDate: nextDueTask.dueDate,
      }
    : null;

  const recentCompletedTaskDto: RecentCompletedTaskDto | null =
    recentCompletedTask
      ? {
          id: recentCompletedTask.id,
          title: recentCompletedTask.title,
          completedAt: recentCompletedTask.completedAt,
        }
      : null;

  const stats = {
    pendingCount: statusCounts.byStatusCounts.pending,
    inProgressCount: statusCounts.byStatusCounts.in_progress,
    completedCount: statusCounts.byStatusCounts.done,
  };

  return {
    user,
    stats,
    invitedProjects,
    recentCompletedTask: recentCompletedTaskDto,
    nextDueTask: nextDueTaskDto,
  };
};

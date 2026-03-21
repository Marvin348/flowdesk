import type { Project } from "@/type/domain/project";
import type { Task } from "@/type/domain/task";

export type DashboardOverviewStats = {
  activeProjects: number;
  totalTasks: number;
  openTasks: number;
  completionRate: number;
};

export const getDashboardOverviewStats = (
  projects: Project[],
  tasks: Task[],
) => {
  const stats = tasks.reduce(
    (acc, t) => {
      if (t.taskStatus === "done") {
        acc.completedCount += 1;
      }

      acc.byStatusCounts[t.taskStatus] += 1;

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

  const totalTasks = tasks.length;
  const activeProjects = projects.filter(
    (pro) => pro.projectStatus !== "done",
  ).length;
  const openTasks =
    stats.byStatusCounts.pending + stats.byStatusCounts.in_progress;

  const completionRate = totalTasks
    ? Math.round((stats.byStatusCounts.done / totalTasks) * 100)
    : 0;

  return {
    activeProjects,
    totalTasks,
    openTasks,
    completionRate,
  };
};

import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats.js";
import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityDistribution.js";
import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution.js";
import { mapUpcomingTasks } from "@/features/dashboard/mappers/mapUpcomingTasks.js";
import { mapPerformanceHighlights } from "@/features/dashboard/mappers/mapPerformanceHighlights.js";
import { getUserPerformance } from "@/features/dashboard/utils/getUserPerformance.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";
import { PRIORITY, type Priority } from "@shared/types/priority.js";
import { STATUSBASE, type StatusBase } from "@shared/types/StatusBase.js";

type ToDashboardOverviewDtoParams = {
  projects: Project[];
  tasks: Task[];
  users: User[];
};

export const toDashboardOverviewDto = ({
  projects,
  tasks,
  users,
}: ToDashboardOverviewDtoParams) => {
  const userPerformance = getUserPerformance(users, tasks);
  const statusCounts = Object.fromEntries(
    STATUSBASE.map((status) => [status, 0]),
  ) as Record<StatusBase, number>;
  const priorityCounts = Object.fromEntries(
    PRIORITY.map((priority) => [priority, 0]),
  ) as Record<Priority, number>;

  tasks.forEach((task) => {
    statusCounts[task.taskStatus] += 1;
    priorityCounts[task.taskPriority] += 1;
  });

  return {
    overviewStats: mapDashboardOverviewStats({
      activeProjects: projects.filter((p) => p.projectStatus !== "done").length,
      totalTasks: tasks.length,
      doneTasks: statusCounts.done,
      openTasks: statusCounts.pending + statusCounts.in_progress,
    }),
    taskStatusDistribution: mapTaskStatusDistribution(statusCounts),
    taskPriorityDistribution: mapTaskPriorityItems(priorityCounts),
    upcomingTasks: mapUpcomingTasks(projects, tasks), // projects ? sort
    performanceHighlights: mapPerformanceHighlights(userPerformance),
  };
};

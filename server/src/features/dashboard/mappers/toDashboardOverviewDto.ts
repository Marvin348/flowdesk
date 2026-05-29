import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats.js";
import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityDistribution.js";
import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution.js";
import { mapUpcomingTasks } from "@/features/dashboard/mappers/mapUpcomingTasks.js";
import { mapPerformanceHighlights } from "@/features/dashboard/mappers/mapPerformanceHighlights.js";
import { getUserPerformance } from "@/features/dashboard/utils/getUserPerformance.js";
import { Project } from "@shared/types/project.js";
import { Task } from "@shared/types/task.js";
import { User } from "@shared/types/user.js";

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

  return {
    overviewStats: mapDashboardOverviewStats(projects, tasks),
    taskStatusDistribution: mapTaskStatusDistribution(tasks),
    taskPriorityDistribution: mapTaskPriorityItems(tasks),
    upcomingTasks: mapUpcomingTasks(projects, tasks), // projects ? sort
    performanceHighlights: mapPerformanceHighlights(userPerformance),
  };
};

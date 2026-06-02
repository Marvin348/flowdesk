import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service.js";
import { getPerformanceHighlights } from "@/features/dashboard/services/dashboardPerformanceHighlights.service.js";
import { getTaskPriorityDistribution } from "@/features/dashboard/services/dashboardTaskPriorityDistribution.service.js";
import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service.js";
import { getUpcomingTasks } from "@/features/dashboard/services/dashboardUpcomingTasks.service.js";

export const getDashboardOverview = async (userId: string) => {
  const [
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  ] = await Promise.all([
    getOverviewStats(userId),
    getTaskStatusDistribution(userId),
    getTaskPriorityDistribution(userId),
    getUpcomingTasks(userId),
    getPerformanceHighlights(userId),
  ]);

  return {
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  };
};

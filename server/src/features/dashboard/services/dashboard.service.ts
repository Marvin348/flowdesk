import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service.js";
import { getPerformanceHighlights } from "@/features/dashboard/services/dashboardPerformanceHighlights.service.js";
import { getTaskPriorityDistribution } from "@/features/dashboard/services/dashboardTaskPriorityDistribution.service.js";
import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service.js";
import { getUpcomingTasks } from "@/features/dashboard/services/dashboardUpcomingTasks.service.js";

export const getDashboardOverview = async () => {
  const [
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  ] = await Promise.all([
    getOverviewStats(),
    getTaskStatusDistribution(),
    getTaskPriorityDistribution(),
    getUpcomingTasks(),
    getPerformanceHighlights(),
  ]);

  return {
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  };
};

import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service.js";
import { getPerformanceHighlights } from "@/features/dashboard/services/dashboardPerformanceHighlights.service.js";
import { getTaskPriorityDistribution } from "@/features/dashboard/services/dashboardTaskPriorityDistribution.service.js";
import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service.js";
import { getUpcomingTasks } from "@/features/dashboard/services/dashboardUpcomingTasks.service.js";
import { Types } from "mongoose";

export const getDashboardOverview = async (workspaceId: Types.ObjectId) => {
  const [
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  ] = await Promise.all([
    getOverviewStats({ workspaceId }),
    getTaskStatusDistribution({ workspaceId }),
    getTaskPriorityDistribution({ workspaceId }),
    getUpcomingTasks({ workspaceId }),
    getPerformanceHighlights({ workspaceId }),
  ]);

  return {
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  };
};

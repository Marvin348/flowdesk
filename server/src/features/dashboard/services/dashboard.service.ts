import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service";
import { getPerformanceHighlights } from "@/features/dashboard/services/dashboardPerformanceHighlights.service";
import { getTaskPriorityDistribution } from "@/features/dashboard/services/dashboardTaskPriorityDistribution.service";
import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service";
import { getUpcomingTasks } from "@/features/dashboard/services/dashboardUpcomingTasks.service";
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

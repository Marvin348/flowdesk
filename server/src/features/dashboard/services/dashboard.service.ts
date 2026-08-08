import { getOverviewStats } from "@/features/dashboard/services/dashboardOverviewStats.service";
import { getTaskStatusDistribution } from "@/features/dashboard/services/dashboardTaskStatusDistribution.service";
import { Types } from "mongoose";
import { getDashboardUrgentTasks } from "@/features/dashboard/services/dashboardUrgentTasks.service";
import { getDashboardAttentionItems } from "@/features/dashboard/services/dashboardAttentionItems.service";
import type { DashboardOverviewDto } from "@shared/types/dto/dashboard/dashboardOverview.dto";

export const getDashboardOverview = async (
  workspaceId: Types.ObjectId,
): Promise<DashboardOverviewDto> => {
  const [
    overviewStats,
    urgentTasks,
    attentionRequired,
    taskStatusDistribution,
  ] = await Promise.all([
    getOverviewStats({ workspaceId }),
    getDashboardUrgentTasks({ workspaceId }),
    getDashboardAttentionItems({ workspaceId }),
    getTaskStatusDistribution({ workspaceId }),
  ]);

  return {
    overviewStats,
    urgentTasks,
    attentionRequired,
    taskStatusDistribution,
  };
};

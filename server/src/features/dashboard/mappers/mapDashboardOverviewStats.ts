import { calcPercent } from "@/shared/utils/calcPercent.js";
import type { DashboardOverviewStatsDto } from "@shared/types/dto/dashboard/dashboardOverviewStats.dto.js";

type MapDashboardOverviewStatsParams = {
  activeProjects: number;
  totalTasks: number;
  doneTasks: number;
  openTasks: number;
};

export const mapDashboardOverviewStats = ({
  activeProjects,
  totalTasks,
  doneTasks,
  openTasks,
}: MapDashboardOverviewStatsParams): DashboardOverviewStatsDto => {
  const completionRate = calcPercent(doneTasks, totalTasks);

  return {
    activeProjects,
    totalTasks,
    openTasks,
    completionRate,
  };
};

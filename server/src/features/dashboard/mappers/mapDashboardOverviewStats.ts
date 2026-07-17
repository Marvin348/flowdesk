import { calcPercent } from "@/shared/utils/calcPercent";
import type { DashboardOverviewStatsDto } from "@shared/types/dto/dashboard/dashboardOverviewStats.dto";

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

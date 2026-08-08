import type { DashboardOverviewStatsDto } from "@shared/types/dto/dashboard/dashboardOverviewStats.dto";

type MapDashboardOverviewStatsParams = {
  activeProjects: number;
  openTasks: number;
  overdueTasks: number;
  tasksDueThisWeek: number;
};

export const mapDashboardOverviewStats = ({
  activeProjects,
  openTasks,
  overdueTasks,
  tasksDueThisWeek,
}: MapDashboardOverviewStatsParams): DashboardOverviewStatsDto => {
  return {
    activeProjects,
    openTasks,
    overdueTasks,
    tasksDueThisWeek,
  };
};

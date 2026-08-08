import type { DashboardOverviewStatsDto } from "@shared/types/dto/dashboard/dashboardOverviewStats.dto";

export type StatCardItem = {
  id: string;
  label: string;
  value: number;
};

export const mapDashboardStatCards = (
  stats: DashboardOverviewStatsDto,
): StatCardItem[] => {
  return [
    {
      id: "activeProjects",
      label: "Aktive Projekte",
      value: stats.activeProjects,
    },
    {
      id: "openTasks",
      label: "Offene Aufgaben",
      value: stats.openTasks,
    },
    {
      id: "overdueTasks",
      label: "Überfällig",
      value: stats.overdueTasks,
    },
    {
      id: "tasksDueThisWeek",
      label: "Diese Woche fällig",
      value: stats.tasksDueThisWeek,
    },
  ];
};

import type { DashboardOverviewStats } from "@/utils/overview/getDashboardOverviewStats";

export type StatCardItem = {
  id: string;
  label: string;
  value: number;
  iconKey: "projects" | "totalTasks" | "completionRate" | "openTasks";
};

export const getDashboardStatCards = (
  stats: DashboardOverviewStats,
): StatCardItem[] => {
  return [
    {
      id: "activeProjects",
      label: "Aktive Projekte",
      value: stats.activeProjects,
      iconKey: "projects",
    },
    {
      id: "allTasks",
      label: "Alle Aufgaben",
      value: stats.totalTasks,
      iconKey: "totalTasks",
    },
    {
      id: "openTasks",
      label: "Aktive Aufgaben",
      value: stats.openTasks,
      iconKey: "openTasks",
    },
    {
      id: "rate",
      label: "Completion Rate",
      value: stats.completionRate,
      iconKey: "completionRate",
    },
  ];
};

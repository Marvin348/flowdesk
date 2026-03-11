import type { TeamStats } from "./getTeamStats";

export type StatCardItem = {
  id: string;
  label: string;
  value: number;
  iconKey: "users" | "openTasks" | "efficiency" | "allTasks";
};

export const getTeamStatCards = (
  teamOverviewStats: TeamStats,
): StatCardItem[] => {
  return [
    {
      id: "members",
      label: "Mitglieder",
      value: teamOverviewStats.totalUser,
      iconKey: "users",
    },
    {
      id: "allTasks",
      label: "Alle Aufgaben",
      value: teamOverviewStats.totalTasks,
      iconKey: "allTasks",
    },
    {
      id: "openTasks",
      label: "Aktive Aufgaben",
      value: teamOverviewStats.totalOpenTasks,
      iconKey: "openTasks",
    },
    {
      id: "rate",
      label: "Completion Rate",
      value: teamOverviewStats.completionRate,
      iconKey: "efficiency",
    },
  ];
};

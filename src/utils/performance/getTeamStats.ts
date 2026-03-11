import type { UserPerformance } from "./getUserPerformance";

export type TeamStats = {
  totalUser: number;
  totalOpenTasks: number;
  completionRate: number;
  totalTasks: number;
};

export const getTeamStats = (
  userPerformance: UserPerformance[],
): TeamStats => {
  const totalUser = userPerformance.length;

  const totals = userPerformance.reduce(
    (acc, user) => {
      acc.totalTasks += user.stats.tasksCount;
      acc.totalOpenTasks += user.stats.openTasks;
      acc.completedTasks += user.stats.completedCount;
      return acc;
    },
    {
      totalTasks: 0,
      totalOpenTasks: 0,
      completedTasks: 0,
    },
  );

  const completionRate = totals.totalTasks
    ? Math.round((totals.completedTasks / totals.totalTasks) * 100)
    : 0;

  return {
    totalUser,
    totalOpenTasks: totals.totalOpenTasks,
    totalTasks: totals.totalTasks,
    completionRate,
  };
};

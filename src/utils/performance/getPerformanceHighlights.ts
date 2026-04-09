import type { UserPerformance } from "@/utils/performance/getUserPerformance";

export type PerformanceType =
  | "overloaded"
  | "mostOpenTasks"
  | "mostCompleted"
  | "bestProgress";

export type PerformanceHighlight = {
  type: PerformanceType;
  user: Pick<UserPerformance, "name" | "avatarKey">;
  stats: {
    completedCount: number;
    openTasks: number;
    progressPercent: number;
    tasksCount: number;
  };
};

export const getPerformanceHighlights = (
  userPerformance: UserPerformance[],
): PerformanceHighlight[] => {
  if (userPerformance.length === 0) {
    return [];
  }

  const highlightMap = userPerformance.reduce(
    (best, next) => {
      if (
        next.stats.openTasks > best.overloaded.stats.openTasks &&
        next.stats.progressPercent < best.overloaded.stats.progressPercent
      ) {
        best.overloaded = next;
      }

      if (next.stats.openTasks > best.mostOpenTasks.stats.openTasks) {
        best.mostOpenTasks = next;
      }

      if (next.stats.completedCount > best.mostCompleted.stats.completedCount) {
        best.mostCompleted = next;
      }

      if (
        next.stats.progressPercent > best.bestProgress.stats.progressPercent
      ) {
        best.bestProgress = next;
      }

      return best;
    },
    {
      overloaded: userPerformance[0],
      mostOpenTasks: userPerformance[0],
      mostCompleted: userPerformance[0],
      bestProgress: userPerformance[0],
    },
  );

  // refactor later
  const performanceHighlights: PerformanceHighlight[] = [
    {
      type: "overloaded",
      user: {
        name: highlightMap.overloaded.name,
        avatarKey: highlightMap.overloaded.avatarKey,
      },
      stats: highlightMap.overloaded.stats,
    },
    {
      type: "mostOpenTasks",
      user: {
        name: highlightMap.mostOpenTasks.name,
        avatarKey: highlightMap.mostOpenTasks.avatarKey,
      },
      stats: highlightMap.mostOpenTasks.stats,
    },
    {
      type: "mostCompleted",
      user: {
        name: highlightMap.mostCompleted.name,
        avatarKey: highlightMap.mostCompleted.avatarKey,
      },
      stats: highlightMap.mostCompleted.stats,
    },

    {
      type: "bestProgress",
      user: {
        name: highlightMap.bestProgress.name,
        avatarKey: highlightMap.bestProgress.avatarKey,
      },
      stats: highlightMap.bestProgress.stats,
    },
  ];

  return performanceHighlights;
};

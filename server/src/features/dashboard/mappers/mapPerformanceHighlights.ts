import type { UserPerformance } from "@/features/dashboard/types/userPerformance.types.js";
import type { PerformanceHighlightDto } from "@shared/types/dto/dashboard/performanceHighlights.dto.js";
import { getMaxBy } from "@/features/dashboard/utils/getMaxBy.js";

export const mapPerformanceHighlights = (
  userPerformance: UserPerformance[],
): PerformanceHighlightDto[] => {
  if (userPerformance.length === 0) return [];

  const mostOpenTask = getMaxBy(
    userPerformance,
    (item) => item.stats.openTasks,
  );
  const mostCompleted = getMaxBy(
    userPerformance,
    (item) => item.stats.completedCount,
  );
  const bestProgress = getMaxBy(
    userPerformance,
    (item) => item.stats.progressPercent,
  );

  if (!mostOpenTask || !mostCompleted || !bestProgress) return [];

  const overloaded = userPerformance.reduce((best, current) => {
    if (
      current.stats.openTasks > best.stats.openTasks &&
      current.stats.progressPercent < best.stats.progressPercent
    ) {
      return current;
    }
    return best;
  }, userPerformance[0]);

  return [
    {
      type: "mostOpenTasks",
      user: mostOpenTask.user,
      stats: mostOpenTask.stats,
    },
    {
      type: "mostCompleted",
      user: mostCompleted.user,
      stats: mostCompleted.stats,
    },
    {
      type: "bestProgress",
      user: bestProgress.user,
      stats: bestProgress.stats,
    },
    {
      type: "overloaded",
      user: overloaded.user,
      stats: overloaded.stats,
    },
  ];
};

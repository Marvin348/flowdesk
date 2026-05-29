import type { DashboardOverviewStatsDto } from "./dashboardOverviewStats.dto";
import type { TaskStatusDistributionDto } from "./taskStatusDistribution.dto";
import type { TaskPriorityItemDto } from "./taskPriorityItem.dto";
import type { UpcomingTaskDto } from "./upcomingTask.dto";
import type { PerformanceHighlightDto } from "./performanceHighlights.dto";

export type DashboardOverviewDto = {
  overviewStats: DashboardOverviewStatsDto;
  taskStatusDistribution: TaskStatusDistributionDto;
  taskPriorityDistribution: TaskPriorityItemDto[];
  upcomingTasks: UpcomingTaskDto[];
  performanceHighlights: PerformanceHighlightDto[];
};

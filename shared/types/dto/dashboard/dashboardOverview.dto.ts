import type { DashboardOverviewStatsDto } from "./dashboardOverviewStats.dto";
import type { TaskStatusDistributionDto } from "./taskStatusDistribution.dto";
import type { DashboardUrgentTaskDto } from "./dashboardUrgentTasks.dto";
import type {DashboardAttentionRequiredDto} from "./dashboardAttentionRequired.dto"

export type DashboardOverviewDto = {
  overviewStats: DashboardOverviewStatsDto;
  urgentTasks: DashboardUrgentTaskDto;
  attentionRequired: DashboardAttentionRequiredDto,
  taskStatusDistribution: TaskStatusDistributionDto;
};

import type {
  MostOverdueProjectDto,
  DeadlineRiskDto,
  LowProgressRiskDto,
} from "@shared/types/dto/dashboard/dashboardAttentionRequired.dto";

export type AttentionRequiredCardItem =
  | MostOverdueProjectDto
  | DeadlineRiskDto
  | LowProgressRiskDto
  | null;

import type { StatusBase } from "../../StatusBase";

export type MostOverdueProjectDto = {
  id: string;
  title: string;
  type: "most_overdue";
  dueDate: string;
  projectStatus: StatusBase;
  daysRemaining: number;
};

export type DeadlineRiskDto = {
  id: string;
  title: string;
  dueDate: string;
  type: "deadline_risk";
  projectStatus: StatusBase;
  daysRemaining: number;
  completionRate: number;
  openTaskCount: number;
};

export type LowProgressRiskDto = {
  id: string;
  title: string;
  type: "low_progress_risk";
  projectStatus: StatusBase;
  daysRemaining: number;
  completionRate: number;
  openTaskCount: number;
};

export type DashboardAttentionRequiredDto = {
  mostOverdueProject: MostOverdueProjectDto | null;
  deadlineRisk: DeadlineRiskDto | null;
  lowProgressRisk: LowProgressRiskDto | null;
};

import type { Types } from "mongoose";
import type { StatusBase } from "@shared/types/StatusBase";
import { toIsoString } from "@/utils/toIsoString";
import type { DashboardAttentionRequiredDto } from "@shared/types/dto/dashboard/dashboardAttentionRequired.dto";

type MostOverdueProjectAggregationItem = {
  _id: Types.ObjectId;
  title: string;
  projectStatus: StatusBase;
  dueDate: Date;
  daysRemaining: number;
};

type DeadlineRiskAggregationItem = {
  _id: Types.ObjectId;
  title: string;
  projectStatus: StatusBase;
  dueDate: Date;
  daysRemaining: number;
  completionRate: number;
  openTaskCount: number;
};

type LowProgressRiskAggregationItem = {
  _id: Types.ObjectId;
  projectStatus: StatusBase;
  title: string;
  completionRate: number;
  openTaskCount: number;
  daysRemaining: number;
};

export type DashboardAttentionRequiredAggregationResult = {
  mostOverdueProject: MostOverdueProjectAggregationItem | null;
  deadlineRisk: DeadlineRiskAggregationItem | null;
  lowProgressRisk: LowProgressRiskAggregationItem | null;
};

export const mapDashboardAttentionRequired = (
  result: DashboardAttentionRequiredAggregationResult,
): DashboardAttentionRequiredDto => ({
  mostOverdueProject: result.mostOverdueProject
    ? {
        id: result.mostOverdueProject._id.toString(),
        title: result.mostOverdueProject.title,
        projectStatus: result.mostOverdueProject.projectStatus,
        dueDate: toIsoString(result.mostOverdueProject.dueDate),
        daysRemaining: result.mostOverdueProject.daysRemaining,
        type: "most_overdue",
      }
    : null,

  deadlineRisk: result.deadlineRisk
    ? {
        id: result.deadlineRisk._id.toString(),
        title: result.deadlineRisk.title,
        projectStatus: result.deadlineRisk.projectStatus,
        dueDate: toIsoString(result.deadlineRisk.dueDate),
        daysRemaining: result.deadlineRisk.daysRemaining,
        completionRate: result.deadlineRisk.completionRate,
        openTaskCount: result.deadlineRisk.openTaskCount,
        type: "deadline_risk",
      }
    : null,

  lowProgressRisk: result.lowProgressRisk
    ? {
        id: result.lowProgressRisk._id.toString(),
        title: result.lowProgressRisk.title,
        projectStatus: result.lowProgressRisk.projectStatus,
        daysRemaining: result.lowProgressRisk.daysRemaining,
        completionRate: result.lowProgressRisk.completionRate,
        openTaskCount: result.lowProgressRisk.openTaskCount,
        type: "low_progress_risk",
      }
    : null,
});

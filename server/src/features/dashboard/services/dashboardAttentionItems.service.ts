import { ProjectModel } from "@/features/projects/models/project.model";
import { buildDashboardAttentionRequiredPipeline } from "@/features/projects/queries/AttentionItems/dashboardAttentionItems.pipeline";
import { Types } from "mongoose";
import { getDashboardDateRange } from "@/features/dashboard/utils/getDashboardDateRange";
import {
  mapDashboardAttentionRequired,
  type DashboardAttentionRequiredAggregationResult,
} from "@/features/dashboard/mappers/mapAttentionRequired";
import type { DashboardAttentionRequiredDto } from "@shared/types/dto/dashboard/dashboardAttentionRequired.dto";

type GetDashboardAttentionItemsInput = {
  workspaceId: Types.ObjectId;
};

export const getDashboardAttentionItems = async ({
  workspaceId,
}: GetDashboardAttentionItemsInput): Promise<DashboardAttentionRequiredDto> => {
  const { startOfToday } = getDashboardDateRange();

  const pipeline = buildDashboardAttentionRequiredPipeline({
    workspaceId,
    startOfToday,
  });

  const [result] =
    await ProjectModel.aggregate<DashboardAttentionRequiredAggregationResult>(
      pipeline,
    );

  return mapDashboardAttentionRequired(result);
};

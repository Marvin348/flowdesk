import { Types } from "mongoose";
import { buildProjectWorkloadPreviewPipeline } from "@/features/projects/queries/workload/projectWorkloadPreview.pipeline";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import { TaskModel } from "@/features/tasks/models/task.model";
import { ProjectWorkloadAggregationItem } from "@/features/projects/mappers/projectWorkload.mapper";
import { toProjectUserWorkloadDto } from "@/features/projects/mappers/projectWorkload.mapper";

type GetProjectWorkloadPreviewInput = {
  projectId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  limit: number;
};

export const getProjectWorkloadPreview = async ({
  projectId,
  workspaceId,
  limit = 5,
}: GetProjectWorkloadPreviewInput): Promise<UserWorkload[]> => {
  const pipeline = buildProjectWorkloadPreviewPipeline({
    projectId,
    workspaceId,
    limit,
  });

  const result =
    await TaskModel.aggregate<ProjectWorkloadAggregationItem>(pipeline);

  return result.map(toProjectUserWorkloadDto);
};

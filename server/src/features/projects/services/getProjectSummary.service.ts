import { ProjectSummariesResponseDto } from "@shared/types/dto/projects/projectSummary.dto";
import { toProjectSummaryDto } from "@/features/projects/mappers/project-summary.mapper";
import { ProjectModel } from "@/features/projects/models/project.model";
import { buildProjectSummaryPipeline } from "@/features/projects/queries/projectSummary.pipeline";
import { ProjectSummaryQueryParams } from "@/features/projects/validation/projectSummary.validator";
import { Types } from "mongoose";

type GetProjectSummaryInput = {
  workspaceId: Types.ObjectId;
  query: ProjectSummaryQueryParams;
};

export const getProjectSummary = async ({
  workspaceId,
  query,
}: GetProjectSummaryInput): Promise<ProjectSummariesResponseDto> => {
  const pipeline = buildProjectSummaryPipeline({
    workspaceId,
    query,
  });

  const [result] = await ProjectModel.aggregate(pipeline);
  const totalItems = result.metaData[0]?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items: result.data.map(toProjectSummaryDto),
    pagination: {
      totalPages,
      currentPage: query.page,
    },
  };
};

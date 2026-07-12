import { ProjectSummariesResponseDto } from "@shared/types/dto/projects/projectSummary.dto.js";
import { toProjectSummaryDto } from "@/features/projects/mappers/project-summary.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { buildProjectSummaryPipeline } from "@/features/projects/queries/projectSummary.pipeline.js";
import { ProjectSummaryQueryParams } from "@/features/projects/validation/projectSummary.validator.js";
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

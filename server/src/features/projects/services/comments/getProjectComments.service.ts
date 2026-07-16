import { Types } from "mongoose";
import type { ProjectCommentsQuery } from "@/features/projects/validation/projectCommentsSchema.validator.js";
import mongoose from "mongoose";
import { buildProjectCommentsPipeline } from "@/features/projects/queries/comments/projectComments.pipeline.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { ProjectCommentsAggregationResult } from "@/features/projects/mappers/projectComments.mapper.js";
import { ProjectCommentsResponseDto } from "@shared/types/dto/projects/projectComments.dto.js";
import { toProjectCommentsDto } from "@/features/projects/mappers/projectComments.mapper.js";
import { AppError } from "@/utils/AppError.js";

type GetProjectCommentsInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
  query: ProjectCommentsQuery;
};

export const getProjectComments = async ({
  workspaceId,
  projectId,
  query,
}: GetProjectCommentsInput): Promise<ProjectCommentsResponseDto> => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectCommentsPipeline({
    workspaceId,
    projectId: projectObjectId,
    query,
  });

  const [result] =
    await ProjectModel.aggregate<ProjectCommentsAggregationResult>(pipeline);

  if (!result) {
    throw new AppError("Project not found", 404);
  }
  const projectComments = toProjectCommentsDto(result);
  const totalItems = result.totalItems ?? 0;

  return {
    ...projectComments,
    totalItems,
    hasMore: totalItems > projectComments.comments.length,
  };
};

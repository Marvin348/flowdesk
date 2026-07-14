import { Types } from "mongoose";
import { buildProjectOverviewPipeline } from "@/features/projects/queries/projectOverview.pipeline.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { AppError } from "@/utils/AppError.js";
import {
  ProjectOverviewAggregationResult,
  toProjectOverviewDto,
} from "@/features/projects/mappers/projectOverview.mapper.js";
import mongoose from "mongoose";

type GetProjectOverviewInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
};

export const getProjectOverview = async ({
  workspaceId,
  projectId,
}: GetProjectOverviewInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectOverviewPipeline({
    workspaceId,
    projectId: projectObjectId,
  });

  const [projectOverview] =
    await ProjectModel.aggregate<ProjectOverviewAggregationResult>(pipeline);

  if (!projectOverview) {
    throw new AppError("Project not found", 404);
  }

  return toProjectOverviewDto(projectOverview);
};

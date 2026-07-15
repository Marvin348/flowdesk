import { mongo, Types } from "mongoose";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { AppError } from "@/utils/AppError.js";
import { buildProjectDetailsPipeline } from "@/features/projects/queries/projectDetails.pipeline.js";
import {
  ProjectDetailsAggregationResult,
  toProjectDetailsDto,
} from "@/features/projects/mappers/project-details.mapper.js";
import mongoose from "mongoose";

type GetProjectDetailsInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
};

export const getProjectDetails = async ({
  workspaceId,
  projectId,
}: GetProjectDetailsInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectDetailsPipeline({
    workspaceId,
    projectId: projectObjectId,
  });

  const [projectDetails] =
    await ProjectModel.aggregate<ProjectDetailsAggregationResult>(pipeline);

  if (!projectDetails) {
    throw new AppError("Project not found", 404);
  }

  return toProjectDetailsDto(projectDetails);
};

import { Types } from "mongoose";
import mongoose from "mongoose";
import { buildProjectWorkloadPipeline } from "@/features/projects/queries/workload/projectWorkload.pipeline.js";
import { ProjectWorkloadQuery } from "@/features/projects/validation/projectWorkloadSchema.validator.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { ProjectWorkloadDto } from "@shared/types/dto/workload/projectUserWorkload.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import {
  ProjectWorkloadAggregationResult,
  toProjectUserWorkloadDto,
} from "@/features/projects/mappers/projectWorkload.mapper.js";
import { AppError } from "@/utils/AppError.js";

type ProjectWorloadInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
  query: ProjectWorkloadQuery;
};

export const getProjectWorkload = async ({
  workspaceId,
  projectId,
  query,
}: ProjectWorloadInput): Promise<ProjectWorkloadDto> => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const projectExists = await ProjectModel.exists({
    _id: projectObjectId,
    workspaceId,
  });

  if (!projectExists) {
    throw new AppError("Project not found", 404);
  }

  const pipeline = buildProjectWorkloadPipeline({
    workspaceId,
    projectId: projectObjectId,
    query,
  });

  const [result] =
    await TaskModel.aggregate<ProjectWorkloadAggregationResult>(pipeline);

  const data = result?.data ?? [];
  const totalItems = result.metaData[0].totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items: data.map(toProjectUserWorkloadDto),
    pagination: {
      totalPages,
      currentPage: query.page,
    },
  };
};

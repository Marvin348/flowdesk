import { Types } from "mongoose";
import mongoose from "mongoose";
import { buildProjectWorkloadPipeline } from "@/features/projects/queries/workload/projectWorkload.pipeline";
import { ProjectWorkloadQuery } from "@/features/projects/validation/projectWorkloadSchema.validator";
import { TaskModel } from "@/features/tasks/models/task.model";
import { ProjectWorkloadDto } from "@shared/types/dto/workload/projectUserWorkload";
import { ProjectModel } from "@/features/projects/models/project.model";
import {
  ProjectWorkloadAggregationResult,
  toProjectUserWorkloadDto,
} from "@/features/projects/mappers/projectWorkload.mapper";
import { AppError } from "@/utils/AppError";

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

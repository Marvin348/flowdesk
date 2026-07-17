import { Types } from "mongoose";
import mongoose from "mongoose";
import { buildProjectTasksPipeline } from "@/features/projects/queries/projectTasks.pipeline";
import { TaskModel } from "@/features/tasks/models/task.model";
import {
  toProjectTasksDto,
  type ProjectTasksAggregationResult,
} from "@/features/projects/mappers/projectTasks.mapper";
import { AppError } from "@/utils/AppError";

type GetProjectTasksInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
};

export const getProjectTasks = async ({
  workspaceId,
  projectId,
}: GetProjectTasksInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectTasksPipeline({
    workspaceId,
    projectId: projectObjectId,
  });

  const [projectTasks] =
    await TaskModel.aggregate<ProjectTasksAggregationResult>(pipeline);

  if (!projectTasks) {
    throw new AppError("ProjectTask not found", 404);
  }

  return toProjectTasksDto(projectTasks);
};

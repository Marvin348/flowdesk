import mongoose, { Types } from "mongoose";
import { ProjectTasksQuery } from "@/features/projects/validation/projectTasksSchema.validator";
import { buildProjectTasksPipeline } from "@/features/projects/queries/tasks/projectTasks.pipeline";
import { TaskModel } from "@/features/tasks/models/task.model";
import { mapTasksWithCollaborators } from "@/features/projects/mappers/projectTasks.mapper";
import type { ProjectTasksByStatusAggregationResult } from "@/features/projects/mappers/projectTasks.mapper";
import { ProjectTasksByStatus } from "@shared/types/dto/projects/projectTasks.dto";

type GetProjectTasksInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
  query: ProjectTasksQuery;
};
export const getProjectTasksByStatus = async ({
  workspaceId,
  projectId,
  query,
}: GetProjectTasksInput): Promise<ProjectTasksByStatus[]> => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectTasksPipeline({
    workspaceId,
    projectId: projectObjectId,
    query,
  });

  const [result] =
    await TaskModel.aggregate<ProjectTasksByStatusAggregationResult>(pipeline);

  const aggregationResult = result ?? {
    tasks: [],
    collaborators: [],
  };

  return mapTasksWithCollaborators(
    aggregationResult.tasks,
    aggregationResult.collaborators,
  );
};

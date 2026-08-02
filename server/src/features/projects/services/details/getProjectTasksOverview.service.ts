import { Types } from "mongoose";
import mongoose from "mongoose";
import { buildProjectTasksOverviewPipeline } from "@/features/projects/queries/tasks/projectTasksOverview.pipeline";
import { TaskModel } from "@/features/tasks/models/task.model";
import {
  toProjectTasksDto,
  type ProjectTasksAggregationResult,
} from "@/features/projects/mappers/projectTasks.mapper";

type GetProjectTasksOverviewInput = {
  workspaceId: Types.ObjectId;
  projectId: string;
};

export const getProjectTasksOverview = async ({
  workspaceId,
  projectId,
}: GetProjectTasksOverviewInput) => {
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const pipeline = buildProjectTasksOverviewPipeline({
    workspaceId,
    projectId: projectObjectId,
  });

  const [aggregationResult] =
    await TaskModel.aggregate<ProjectTasksAggregationResult>(pipeline);

  const projectTasks = aggregationResult ?? {
    pendingTasks: [],
    inProgressTasks: [],
    doneTasks: [],
    totals: [],
    collaborators: [],
  };

  return toProjectTasksDto(projectTasks);
};

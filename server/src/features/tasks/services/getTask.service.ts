import { Types } from "mongoose";
import { TaskModel } from "@/features/tasks/models/task.model";
import { AppError } from "@/utils/AppError";
import { toTaskDto } from "../mappers/task.mapper";

type GetTaskInput = {
  taskId: string;
  workspaceId: Types.ObjectId;
};

export const getTask = async ({ taskId, workspaceId }: GetTaskInput) => {
  const task = await TaskModel.findOne({ workspaceId, _id: taskId });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return toTaskDto(task);
};

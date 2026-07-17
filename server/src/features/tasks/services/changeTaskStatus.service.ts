import { StatusBase } from "@shared/types/StatusBase";
import { TaskModel } from "@/features/tasks/models/task.model";
import { AppError } from "@/utils/AppError";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { touchProject } from "@/features/projects/services/project.service";
import { Types } from "mongoose";

type ChangeTaskStatusInput = {
  taskId: string;
  taskStatus: StatusBase;
  workspaceId: Types.ObjectId;
};
export const changeTaskStatus = async ({
  taskId,
  taskStatus,
  workspaceId,
}: ChangeTaskStatusInput) => {
  const changedTask = await TaskModel.findOneAndUpdate(
    { _id: taskId, workspaceId },
    { $set: { taskStatus } },
    { returnDocument: "after" },
  );

  if (!changedTask) {
    throw new AppError("Task not found", 404);
  }

  await touchProject({ projectId: changedTask.projectId, workspaceId });

  return toTaskDto(changedTask);
};

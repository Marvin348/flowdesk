import { StatusBase } from "@shared/types/StatusBase.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { AppError } from "@/utils/AppError.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { touchProject } from "@/features/projects/services/project.service.js";

type ChangeTaskStatusInput = {
  taskId: string;
  taskStatus: StatusBase;
  workspaceId: string;
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

import mongoose, { Types } from "mongoose";
import { TaskModel } from "@/features/tasks/models/task.model";
import { EditTaskBodyParams } from "@/features/tasks/validators/editTask.validator";
import { UserRole } from "@shared/types/user";
import { AppError } from "@/utils/AppError";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { eventBus } from "@/shared/events/eventBus";
import type { TaskUpdateEvent } from "../events/taskEvents";

type UpdateTaskInput = {
  workspaceId: Types.ObjectId;
  taskId: string;
  validatedBody: EditTaskBodyParams;
  role: UserRole;
  userId: string;
};
export const updateTask = async ({
  taskId,
  workspaceId,
  validatedBody,
  role,
  userId,
}: UpdateTaskInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (role !== "admin" && role !== "manager") {
    throw new AppError("Only admins and managers can edit tasks", 403);
  }

  const existingTask = await TaskModel.findOne({
    workspaceId,
    _id: taskId,
  }).select("collaboratorIds projectId");

  if (!existingTask) {
    throw new AppError("Task not found", 404);
  }

  const changedTask = await TaskModel.findOneAndUpdate(
    {
      workspaceId,
      _id: taskId,
    },
    { $set: validatedBody },
    { returnDocument: "after", runValidators: true },
  );

  if (!changedTask) {
    throw new AppError("Task not found", 404);
  }

  await eventBus.emit<TaskUpdateEvent>("task.updated", {
    actorId: userObjectId,
    workspaceId,
    taskId: changedTask._id,
    previousCollaboratorIds: existingTask.collaboratorIds,
    projectId: existingTask.projectId,
    currentCollaboratorIds: changedTask.collaboratorIds,
  });

  return toTaskDto(changedTask);
};

import { Types } from "mongoose";
import { TaskModel } from "@/features/tasks/models/task.model";
import { EditTaskBodyParams } from "@/features/tasks/validators/editTask.validator";
import { UserRole } from "@shared/types/user";
import { AppError } from "@/utils/AppError";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";

type UpdateTaskInput = {
  workspaceId: Types.ObjectId;
  taskId: string;
  validatedBody: EditTaskBodyParams;
  role: UserRole;
};
export const updateTask = async ({
  taskId,
  workspaceId,
  validatedBody,
  role,
}: UpdateTaskInput) => {
  if (role !== "admin" && role !== "manager") {
    throw new AppError("Only admins and managers can edit tasks", 403);
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

  return toTaskDto(changedTask);
};

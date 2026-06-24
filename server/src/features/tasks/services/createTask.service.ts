import { CreateTaskFields } from "@/features/tasks/validators/task.validators.js";
import {
  getProjectById,
  touchProject,
} from "@/features/projects/services/project.service.js";
import { AppError } from "@/utils/AppError.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";
import { UserModel } from "@/features/users/models/user.modal.js";

type CreateTaskInput = {
  input: CreateTaskFields;
  userId: string;
  workspaceId: string;
};

export const createTask = async ({
  input,
  userId,
  workspaceId,
}: CreateTaskInput) => {
  const {
    projectId,
    title,
    collaboratorIds,
    dueDate,
    tags,
    taskPriority,
    reminderAt,
    description,
  } = input;

  const project = await getProjectById({
    projectId,
    workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const uniqueCollaboratorIds = [...new Set(collaboratorIds)];

  const matchingUsers = await UserModel.countDocuments({
    _id: { $in: uniqueCollaboratorIds },
    workspaceId,
  });

  if (matchingUsers !== uniqueCollaboratorIds.length) {
    throw new AppError("One or more users are invalid", 400);
  }

  const newTask = await TaskModel.create({
    projectId,
    title,
    collaboratorIds,
    dueDate,
    taskStatus: "pending",
    tags,
    taskPriority,
    reminderAt: reminderAt ?? "none",
    description,
    workspaceId,
  });

  await touchProject({ projectId, workspaceId });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "task.created",
    entityType: "task",
    entityId: newTask._id.toString(),
    metadata: {
      taskTitle: newTask.title,
      taskPriority: newTask.taskPriority,
    },
  });

  return toTaskDto(newTask.toObject());
};

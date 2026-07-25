import { CreateTaskFields } from "@/features/tasks/validators/task.validators";
import {
  getProjectById,
  touchProject,
} from "@/features/projects/services/project.service";
import { AppError } from "@/utils/AppError";
import { TaskModel } from "@/features/tasks/models/task.model";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { createActivity } from "@/features/activity/services/createActivity.service";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose, { Types } from "mongoose";
import { eventBus } from "@/shared/events/eventBus";
import type { TaskCreatedEvent } from "@/features/tasks/events/taskEvents";

type CreateTaskInput = {
  input: CreateTaskFields;
  userId: string;
  workspaceId: Types.ObjectId;
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

  const projectObjectId = new mongoose.Types.ObjectId(projectId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const project = await getProjectById({
    projectId: projectObjectId,
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
    projectId: projectObjectId,
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

  await touchProject({ projectId: projectObjectId, workspaceId });

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

  await eventBus.emit<TaskCreatedEvent>("task.created", {
    actorId: userObjectId,
    workspaceId,
    task: newTask,
  });

  return toTaskDto(newTask.toObject());
};

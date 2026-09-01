import { CreateTaskFields } from "@/features/tasks/validators/task.validators";
import { touchProject } from "@/features/projects/services/project.service";
import { AppError } from "@/utils/AppError";
import { TaskModel } from "@/features/tasks/models/task.model";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { createActivity } from "@/features/activity/services/createActivity.service";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose, { Types } from "mongoose";
import { notificationQueue } from "@/queues/notificationQueue";
import { redisClient } from "@/shared/config/redis";
import { ProjectModel } from "@/features/projects/models/project.model";

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

  const newTask = await mongoose.connection.transaction(async (session) => {
    const project = await ProjectModel.exists({
      _id: projectObjectId,
      workspaceId,
    }).session(session);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const uniqueCollaboratorIds = [...new Set(collaboratorIds)];

    const matchingUsers = await UserModel.countDocuments({
      _id: { $in: uniqueCollaboratorIds },
      workspaceId,
    }).session(session);

    if (matchingUsers !== uniqueCollaboratorIds.length) {
      throw new AppError("One or more users are invalid", 400);
    }

    const [task] = await TaskModel.create(
      [
        {
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
        },
      ],
      { session },
    );

    await touchProject({ projectId: projectObjectId, workspaceId, session });

    // refactore later
    await createActivity({
      workspaceId,
      actorId: userId,
      type: "task.created",
      entityType: "task",
      entityId: task._id.toString(),
      metadata: {
        taskTitle: task.title,
        taskPriority: task.taskPriority,
      },
      session,
    });

    return task;
  });

  await notificationQueue.add("task-assigned", {
    actorId: userObjectId.toString(),
    workspaceId: workspaceId.toString(),
    taskId: newTask._id.toString(),
    projectId: newTask.projectId.toString(),
    collaboratorIds: newTask.collaboratorIds.map((id) => id.toString()),
  });

  await redisClient.publish(
    "realtime-tasks",
    JSON.stringify({
      projectId: newTask.projectId.toString(),
      type: "task:created",
    }),
  );

  return toTaskDto(newTask.toObject());
};

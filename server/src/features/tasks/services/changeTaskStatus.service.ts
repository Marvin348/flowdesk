import { StatusBase } from "@shared/types/StatusBase";
import { TaskModel } from "@/features/tasks/models/task.model";
import { AppError } from "@/utils/AppError";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { touchProject } from "@/features/projects/services/project.service";
import mongoose, { Types } from "mongoose";
import { synchronizeProjectStatus } from "@/features/projects/services/synchronizeProjectStatus.service";
import { redisClient } from "@/shared/config/redis";

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
  const changedTask = await mongoose.connection.transaction(async (session) => {
    const changedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, workspaceId },
      { $set: { taskStatus } },
      { returnDocument: "after" },
    ).session(session);

    if (!changedTask) {
      throw new AppError("Task not found", 404);
    }

    await touchProject({
      projectId: changedTask.projectId,
      workspaceId,
      session,
    });

    await synchronizeProjectStatus({
      projectId: changedTask.projectId,
      workspaceId,
      session,
    });

    return changedTask;
  });

  await redisClient.publish(
    "realtime-tasks",
    JSON.stringify({
      projectId: changedTask.projectId.toString(),
      type: "task:status_changed",
    }),
  );

  return toTaskDto(changedTask);
};

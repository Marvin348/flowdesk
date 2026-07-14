import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto.js";
import { toTaskStatsDto } from "@/features/tasks/mappers/taskStatus.mapper.js";
import { Types } from "mongoose";
import type { StatusBase } from "@shared/types/StatusBase.js";
import type { Priority } from "@shared/types/priority.js";
import { isDefined } from "@/shared/utils/isDefined.js";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper.js";
import { toIsoString } from "@/utils/toIsoString.js";

export type ProjectTasksAggregationTask = {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  taskStatus: StatusBase;
  taskPriority: Priority;
  collaboratorIds: Types.ObjectId[];
  description?: string;
  tags?: string[];
  dueDate: Date;
  reminderAt?: Date;
  completedAt?: Date;
};

export type ProjectTasksAggregationUser = {
  _id: Types.ObjectId;
  avatarKey?: string;
  avatarStorageKey?: string;
};

export type ProjectTasksAggregationResult = {
  tasks: ProjectTasksAggregationTask[];
  collaborators: ProjectTasksAggregationUser[];
};

export const toProjectTasksDto = (
  taskResult: ProjectTasksAggregationResult,
): ProjectTasksResponseDto => {
  const usersById = new Map(
    taskResult.collaborators.map((u) => [u._id.toString(), u]),
  );

  const taskStats = toTaskStatsDto(taskResult.tasks);

  const projectTasks = taskResult.tasks.map((task) => {
    const collaborators = task.collaboratorIds
      .map((id) => usersById.get(id.toString()))
      .filter(isDefined)
      .map((user) => toUserAvatarDto(user));

    return {
      id: task._id.toString(),
      projectId: task.projectId.toString(),
      title: task.title,
      dueDate: toIsoString(task.dueDate),
      taskStatus: task.taskStatus,
      taskPriority: task.taskPriority,
      description: task.description,
      tags: task.tags,
      reminderAt: toIsoString(task.reminderAt),
      completedAt: toIsoString(task.completedAt),
      collaborators,
    };
  });

  return {
    tasks: projectTasks,
    taskStats,
  };
};

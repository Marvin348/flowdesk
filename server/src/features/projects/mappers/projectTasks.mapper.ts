import type { ProjectTasksResponseDto } from "@shared/types/dto/projects/projectTasks.dto";
import { Types } from "mongoose";
import type { StatusBase } from "@shared/types/StatusBase";
import type { Priority } from "@shared/types/Priority";
import { isDefined } from "@/shared/utils/isDefined";
import { toUserAvatarDto } from "@/features/users/mappers/user.mapper";
import { toIsoString } from "@/utils/toIsoString";

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

type TaskStatusTotal = {
  _id: StatusBase;
  total: number;
};

export type ProjectTasksAggregationResult = {
  pendingTasks: ProjectTasksAggregationTask[];
  inProgressTasks: ProjectTasksAggregationTask[];
  doneTasks: ProjectTasksAggregationTask[];

  totals: TaskStatusTotal[];
  collaborators: ProjectTasksAggregationUser[];
};

export const toProjectTasksDto = (
  taskResult: ProjectTasksAggregationResult,
): ProjectTasksResponseDto => {
  const { pendingTasks, inProgressTasks, doneTasks, totals, collaborators } =
    taskResult;

  const pendingTotal =
    totals.find((item) => item._id === "pending")?.total ?? 0;
  const inProgressTotal =
    totals.find((item) => item._id === "in_progress")?.total ?? 0;
  const doneTotal = totals.find((item) => item._id === "done")?.total ?? 0;

  return {
    pending: {
      tasks: mapTasksWithCollaborators(pendingTasks, collaborators),
      total: pendingTotal,
      hasMore: pendingTasks.length < pendingTotal,
    },
    in_progress: {
      tasks: mapTasksWithCollaborators(inProgressTasks, collaborators),
      total: inProgressTotal,
      hasMore: inProgressTasks.length < inProgressTotal,
    },
    done: {
      tasks: mapTasksWithCollaborators(doneTasks, collaborators),
      total: doneTotal,
      hasMore: doneTasks.length < doneTotal,
    },
  };
};

export type ProjectTasksByStatusAggregationResult = {
  tasks: ProjectTasksAggregationTask[];
  collaborators: ProjectTasksAggregationUser[];
};

export const mapTasksWithCollaborators = (
  tasks: ProjectTasksAggregationTask[],
  collaborators: ProjectTasksAggregationUser[],
) => {
  const collaboratorsById = new Map(
    collaborators.map((coll) => [coll._id.toString(), coll]),
  );

  return tasks.map((task) => {
    const collaborators = task.collaboratorIds
      .map((id) => collaboratorsById.get(id.toString()))
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
};

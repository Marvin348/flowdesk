import type {
  NextDueTaskDto,
  UserDetailsDto,
} from "@shared/types/dto/users/user";
import type { RecentCompletedTaskDto } from "@shared/types/dto/users/user";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";
import type { Types } from "mongoose";
import type { UserRole } from "@shared/types/user";
import type { StatusBase } from "@shared/types/StatusBase";
import type { Priority } from "@shared/types/Priority";

export type UserDetailsAggregationResult = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatarKey?: string;
  avatarStorageKey?: string;
  jobTitle?: string;
  role: UserRole;

  invitedProjects: {
    _id: Types.ObjectId;
    title: string;
    priority: Priority;
    projectStatus: StatusBase;
  }[];

  pendingCount: number;
  inProgressCount: number;
  completedCount: number;

  recentCompletedTask?: {
    _id: Types.ObjectId;
    title: string;
    completedAt?: Date | string | null;
  } | null;

  nextDueTask?: {
    _id: Types.ObjectId;
    title: string;
    dueDate?: Date | string | null;
  } | null;
};

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

const toInvitedProjectDto = (
  project: UserDetailsAggregationResult["invitedProjects"][number],
) => {
  return {
    id: project._id.toString(),
    title: project.title,
    priority: project.priority,
    projectStatus: project.projectStatus,
  };
};

const toRecentCompletedTaskDto = (
  task: NonNullable<UserDetailsAggregationResult["recentCompletedTask"]>,
): RecentCompletedTaskDto => {
  return {
    id: task._id.toString(),
    title: task.title,
    completedAt: task.completedAt ? toIsoString(task.completedAt) : "",
  };
};

const toNextDueTaskDto = (
  task: NonNullable<UserDetailsAggregationResult["nextDueTask"]>,
): NextDueTaskDto => {
  return {
    id: task._id.toString(),
    title: task.title,
    dueDate: task.dueDate ? toIsoString(task.dueDate) : "",
  };
};

export const toUserDetailsDto = (
  userDetails: UserDetailsAggregationResult,
): UserDetailsDto => ({
  user: {
    id: userDetails._id.toString(),
    name: userDetails.name,
    email: userDetails.email,
    role: userDetails.role,
    jobTitle: userDetails.jobTitle,
    avatarKey: userDetails.avatarKey,
    avatarUrl: bulidPublicFileUrl(userDetails.avatarStorageKey),
  },

  invitedProjects: userDetails.invitedProjects.map(toInvitedProjectDto),

  stats: {
    pendingCount: userDetails.pendingCount,
    inProgressCount: userDetails.inProgressCount,
    completedCount: userDetails.completedCount,
  },

  recentCompletedTask: userDetails.recentCompletedTask
    ? toRecentCompletedTaskDto(userDetails.recentCompletedTask)
    : null,

  nextDueTask: userDetails.nextDueTask
    ? toNextDueTaskDto(userDetails.nextDueTask)
    : null,
});

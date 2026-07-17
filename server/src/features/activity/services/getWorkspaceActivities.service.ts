import { ActivityModel } from "@/features/activity/models/activity.model";
import { toActivityDto } from "@/features/activity/mappers/activity.mapper";
import type { UserDocument } from "@/features/users/types/user.document";
import { Types } from "mongoose";

type ActivityActor = Pick<UserDocument, "_id" | "name" | "avatarKey" | "avatarStorageKey">;

export const getWorkspaceActivities = async (workspaceId: Types.ObjectId) => {
  const activities = await ActivityModel.find({ workspaceId })
    .sort({ createdAt: -1 })
    .populate<{ actorId: ActivityActor }>("actorId", "name avatarKey avatarStorageKey")
    .lean();

  return activities.map(toActivityDto);
};

import { ActivityModel } from "@/features/activity/models/activity.model.js";
import { toActivityDto } from "@/features/activity/mappers/activity.mapper.js";
import type { UserDocument } from "@/features/users/types/user.document.js";

type ActivityActor = Pick<UserDocument, "_id" | "name" | "avatarKey">;

export const getWorkspaceActivities = async (workspaceId: string) => {
  const activities = await ActivityModel.find({ workspaceId })
    .sort({ createdAt: -1 })
    .populate<{ actorId: ActivityActor }>("actorId", "name avatarKey")
    .lean();

  return activities.map(toActivityDto);
};

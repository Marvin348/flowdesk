import { ActivityModel } from "@/features/activity/models/activity.document.js";
import { toActivityDto } from "@/features/activity/mappers/activity.mapper.js";
import type { UserDocument } from "@/features/users/types/user.document.js";

type ActivityActor = Pick<UserDocument, "_id" | "name" | "email">;

export const getWorkspaceActivities = async (workspaceId: string) => {
  const activities = await ActivityModel.find({ workspaceId })
    .sort({ createdAt: -1 })
    .populate<{ actorId: ActivityActor }>("actorId", "name email")
    .lean();

  return activities.map(toActivityDto);
};

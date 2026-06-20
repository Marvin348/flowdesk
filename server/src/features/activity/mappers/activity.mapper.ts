import { ActivityDocument } from "@/features/activity/types/activity.model.js";
import type { ActivityDto } from "@shared/types/dto/activity/activity.dto.js";
import { Types } from "mongoose";

export type PopulatedActivity = Omit<ActivityDocument, "actorId"> & {
  actorId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
};

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toActivityDto = (activity: PopulatedActivity): ActivityDto => {
  return {
    id: activity._id.toString(),
    type: activity.type,
    entityType: activity.entityType,
    entityId: activity.entityId?.toString(),
    message: activity.message,
    metadata: activity.metadata,
    createdAt: toIsoString(activity.createdAt),
    actor: {
      id: activity.actorId._id.toString(),
      name: activity.actorId.name,
      email: activity.actorId.email,
    },
  };
};

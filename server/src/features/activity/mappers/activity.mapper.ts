import { ActivityDocument } from "@/features/activity/types/activity.document";
import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import { Types } from "mongoose";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";

export type PopulatedActivity = Omit<ActivityDocument, "actorId"> & {
  actorId: {
    _id: Types.ObjectId;
    name: string;
    avatarKey?: string;
    avatarStorageKey?: string
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
    metadata: activity.metadata,
    createdAt: toIsoString(activity.createdAt),
    actor: {
      id: activity.actorId._id.toString(),
      name: activity.actorId.name,
      avatarKey: activity.actorId.avatarKey,
      avatarUrl: bulidPublicFileUrl(activity.actorId.avatarStorageKey),
    },
  };
};

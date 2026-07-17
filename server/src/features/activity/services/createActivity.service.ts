import { ActivityModel } from "@/features/activity/models/activity.model";
import type {
  ActivityType,
  EntityType,
} from "@shared/types/dto/activity/activity.dto";
import { Types } from "mongoose";

type CreateActivityInput = {
  workspaceId: Types.ObjectId;
  actorId: string;
  type: ActivityType;
  entityType: EntityType;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export const createActivity = async ({
  workspaceId,
  actorId,
  type,
  entityType,
  entityId,
  metadata,
}: CreateActivityInput) => {
  return await ActivityModel.create({
    workspaceId,
    actorId,
    type,
    entityType,
    entityId,
    metadata,
  });
};

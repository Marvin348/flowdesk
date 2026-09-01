import { ActivityModel } from "@/features/activity/models/activity.model";
import type {
  ActivityType,
  EntityType,
} from "@shared/types/dto/activity/activity.dto";
import { ClientSession, Types } from "mongoose";

type CreateActivityInput = {
  workspaceId: Types.ObjectId;
  actorId: string;
  type: ActivityType;
  entityType: EntityType;
  entityId: string;
  metadata?: Record<string, unknown>;
  session?: ClientSession;
};

export const createActivity = async ({
  workspaceId,
  actorId,
  type,
  entityType,
  entityId,
  metadata,
  session,
}: CreateActivityInput) => {
  const activity = {
    workspaceId,
    actorId,
    type,
    entityType,
    entityId,
    metadata,
  };

  if (session) {
    const [createdActivity] = await ActivityModel.create([activity], {
      session,
    });

    return createdActivity;
  }

  return await ActivityModel.create(activity);
};

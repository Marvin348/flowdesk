import { ActivityModel } from "@/features/activity/models/activity.document.js";
import type {
  ActivityType,
  EntityType,
} from "@shared/types/dto/activity/activity.dto.js";

type CreateActivityInput = {
  workspaceId: string;
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

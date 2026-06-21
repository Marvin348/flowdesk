import { Types } from "mongoose";
import type {
  ActivityType,
  EntityType,
} from "@shared/types/dto/activity/activity.dto.js";

export type ActivityDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  type: ActivityType;
  entityType: EntityType;
  entityId: Types.ObjectId;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};


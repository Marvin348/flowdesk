import { Types } from "mongoose";
import type {
  NotificationType,
  EntityType,
} from "@shared/types/dto/notification/notification.dto";
import { NotificationModel } from "../models/notification.model";
import type { UserRole } from "@shared/types/user";

type CreateNotificationInput = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
  actorId?: Types.ObjectId;

  type: NotificationType;
  entityType: EntityType;

  metadata?: {
    previousRole?: UserRole;
    currentRole?: UserRole;
  };

  entityId?: Types.ObjectId;
  projectId?: Types.ObjectId;
};

export const createNotification = async ({
  workspaceId,
  recipientId,
  actorId,
  type,
  entityType,
  entityId,
  projectId,
  metadata,
}: CreateNotificationInput) => {
  if (actorId && actorId.equals(recipientId)) {
    return null;
  }

  return NotificationModel.create({
    workspaceId,
    recipientId,
    actorId,
    type,
    entityType,
    entityId,
    metadata,
    projectId,
    isRead: false,
  });
};

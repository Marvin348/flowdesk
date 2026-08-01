import { Types } from "mongoose";
import type {
  NotificationType,
  EntityType,
} from "@shared/types/dto/notification/notification.dto";
import { NotificationModel } from "@/features/notification/models/notification.model";
import type { UserRole } from "@shared/types/user";
import { shouldCreateNotification } from "@/features/notification/services/shouldCreateNotification.service";
import { isDuplicateKeyError } from "@/features/notification/services/deadlines/utils/isDuplicateKeyError";

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
  deadlineAt?: Date;
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
  deadlineAt,
}: CreateNotificationInput) => {
  if (actorId && actorId.equals(recipientId)) return null;

  const shouldCreate = await shouldCreateNotification({
    recipientId,
    workspaceId,
    type,
  });

  if (!shouldCreate) return;

  try {
    await NotificationModel.create({
      workspaceId,
      recipientId,
      actorId,
      type,
      entityType,
      entityId,
      metadata,
      projectId,
      isRead: false,
      deadlineAt,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return;
    }

    throw error;
  }
};

import { Types } from "mongoose";
import type {
  NotificationType,
  EntityType,
} from "@shared/types/dto/notification/notification.dto";
import type { UserRole } from "@shared/types/user";

export type NotificationDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;

  actorId?: Types.ObjectId;
  recipientId: Types.ObjectId; // me

  type: NotificationType;
  entityType: EntityType;

  entityId?: Types.ObjectId; // id from tasks, comments, etc

  projectId?: Types.ObjectId; // maybe useful

  metadata: {
    previousRole: UserRole;
    currentRole: UserRole;
  };

  isRead: boolean;
  readAt?: Date;

  createdAt: Date;
};

import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";
import { toIsoString } from "@/utils/toIsoString";
import type { NotificationAggregationItem } from "@/features/notification/types/notificationAggregation";

export const toNotificationDto = (
  notification: NotificationAggregationItem,
): NotificationDto => ({
  id: notification._id.toString(),

  type: notification.type,
  entityType: notification.entityType,

  metadata: notification.metadata,

  actor: notification.actor
    ? {
        id: notification.actor._id.toString(),
        name: notification.actor.name,
      }
    : undefined,

  task: notification.taskEntity
    ? {
        id: notification.taskEntity._id.toString(),
        title: notification.taskEntity.title,
        projectId: notification.taskEntity.projectId.toString(),
      }
    : undefined,

  project: notification.projectEntity
    ? {
        id: notification.projectEntity._id.toString(),
        title: notification.projectEntity.title,
      }
    : undefined,

  isRead: notification.isRead,
  readAt: toIsoString(notification.readAt),
  createdAt: toIsoString(notification.createdAt),
});

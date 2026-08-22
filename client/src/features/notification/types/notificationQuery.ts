import type { NotificationStatus } from "@shared/types/dto/notification/notification.dto";
import type { NotificationView } from "@shared/types/notificationSettings/notificationSettings";

export type NotificationQuery = {
  page: number;
  limit: number;
  status: NotificationStatus;
  view: NotificationView;
};

import type { NotificationStatus } from "@shared/types/dto/notification/notification.dto";

export type NotificationQuery = {
  page: number;
  limit: number;
  status: NotificationStatus;
};

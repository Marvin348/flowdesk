import type { NotificationDto } from "../notification/notification.dto";

export type PaginatedNotificationsDto = {
  items: NotificationDto[];
  unreadCount: number;
  inboxCount: number;
  archiveCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

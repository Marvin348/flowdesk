import type { NotificationDto } from "../notification/notification.dto";

export type PaginatedNotificationsDto = {
  items: NotificationDto[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

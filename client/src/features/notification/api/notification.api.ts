import { apiClient } from "@/shared/api/client";
import type { PaginatedNotificationsDto } from "@shared/types/dto/notification/getNotification.dto";
import type { NotificationQuery } from "@/features/notification/types/notificationQuery";
import type {
  PinNotificationInput,
  ArchiveNotificationInput,
} from "@/features/notification/types/notification";

export const getNotifications = async ({
  page,
  limit,
  status,
  view,
  filterType,
}: NotificationQuery): Promise<PaginatedNotificationsDto> => {
  const res = await apiClient.get("/notifications", {
    params: {
      page,
      limit,
      status,
      view,
      filterType,
    },
  });
  return res.data.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const res = await apiClient.get("/notifications/unread-count");
  return res.data.unreadCount;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<string> => {
  const res = await apiClient.patch(`/notifications/${notificationId}/read`);
  return res.data.message;
};

export const markAllNotificationsAsRead = async (): Promise<string> => {
  const res = await apiClient.patch("/notifications/read-all");
  return res.data.message;
};

export const pinNotification = async ({
  notificationId,
  pinned,
}: PinNotificationInput): Promise<string> => {
  const res = await apiClient.patch(`/notifications/${notificationId}/pin`, {
    pinned,
  });
  return res.data.message;
};

export const archiveNotification = async ({
  notificationId,
  archived,
}: ArchiveNotificationInput): Promise<string> => {
  const res = await apiClient.patch(
    `/notifications/${notificationId}/archive`,
    {
      archived,
    },
  );
  return res.data.message;
};

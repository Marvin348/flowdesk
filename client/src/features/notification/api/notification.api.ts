import { apiClient } from "@/shared/api/client";
import type { PaginatedNotificationsDto } from "@shared/types/dto/notification/getNotification.dto";
import type { NotificationQuery } from "@/features/notification/types/notificationQuery";

export const getNotifications = async ({
  page,
  limit,
  status,
}: NotificationQuery): Promise<PaginatedNotificationsDto> => {
  const res = await apiClient.get("/notifications", {
    params: {
      page,
      limit,
      status,
    },
  });
  return res.data.data;
};

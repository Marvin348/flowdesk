import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/features/notification/api/notification.api";
import type { NotificationQuery } from "@/features/notification/types/notificationQuery";
import type { PaginatedNotificationsDto } from "@shared/types/dto/notification/getNotification.dto";

export const useNotifications = ({
  page,
  limit,
  status,
}: NotificationQuery) => {
  const { data, isLoading, isError, refetch } = useQuery<
    PaginatedNotificationsDto,
    Error
  >({
    queryFn: () => getNotifications({ page, limit, status }),
    queryKey: ["notifications", { page, limit, status }],
  });

  return { data, isLoading, isError, refetch };
};

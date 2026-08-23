import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/features/notification/api/notification.api";
import type { PaginatedNotificationsDto } from "@shared/types/dto/notification/getNotification.dto";
import { useNotificationSearchParams } from "@/features/notification/hooks/useNotificationSearchParams";
import { PAGE_LIMITS } from "@shared/constants/pagination";

export const useNotifications = () => {
  const { page, status, view, filterType } = useNotificationSearchParams();

  const limit = PAGE_LIMITS.notifications;

  const { data, isLoading, isError, refetch } = useQuery<
    PaginatedNotificationsDto,
    Error
  >({
    queryFn: () =>
      getNotifications({
        page,
        limit,
        status,
        view,
        filterType,
      }),
    queryKey: ["notifications", { page, limit, status, view, filterType }],
  });

  return { data, isLoading, isError, refetch };
};

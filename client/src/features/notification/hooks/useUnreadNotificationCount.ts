import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "@/features/notification/api/notification.api";

export const useUnreadNotificationCount = () => {
  const { data, isLoading, isError } = useQuery<number, Error>({
    queryFn: () => getUnreadNotificationCount(),
    queryKey: ["notifications", "unread-count"],
  });

  return { data, isLoading, isError };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/features/notification/api/notification.api";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

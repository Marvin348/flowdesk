import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pinNotification } from "@/features/notification/api/notification.api";
import type { PinNotificationInput } from "@/features/notification/types/notification";

export const usePinNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, PinNotificationInput>({
    mutationFn: pinNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

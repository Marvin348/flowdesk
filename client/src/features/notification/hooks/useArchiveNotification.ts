import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveNotification } from "@/features/notification/api/notification.api";
import type { ArchiveNotificationInput } from "@/features/notification/types/notification";

export const useArchiveNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, ArchiveNotificationInput>({
    mutationFn: archiveNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

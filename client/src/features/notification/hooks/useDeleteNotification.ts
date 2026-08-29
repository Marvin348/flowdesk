import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteNotification } from "@/features/notification/api/notification.api";

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

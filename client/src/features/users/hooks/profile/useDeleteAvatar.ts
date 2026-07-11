import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteAvatar } from "@/features/users/api/users.api";

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

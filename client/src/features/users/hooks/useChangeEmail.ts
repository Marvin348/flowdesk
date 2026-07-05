import { useQueryClient, useMutation } from "@tanstack/react-query";
import { changeEmail } from "@/features/users/api/users.api";

export const useChangeEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeEmail,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

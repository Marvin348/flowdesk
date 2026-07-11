import { useQueryClient, useMutation } from "@tanstack/react-query";
import { verifyChangedEmail } from "@/features/users/api/users.api";

export const useVerifyChangedEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyChangedEmail,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

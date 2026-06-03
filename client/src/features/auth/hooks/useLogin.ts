import { login } from "@/features/auth/api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
};

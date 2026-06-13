import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/features/auth/api/auth.api";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
};

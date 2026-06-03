import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/features/auth/api/auth.api";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
    },
  });
};

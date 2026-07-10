import { useMutation } from "@tanstack/react-query";
import { verifyChangePassword } from "@/features/auth/api/auth.api";

export const useVerifyChangePassword = () => {
  return useMutation({
    mutationFn: verifyChangePassword,
    retry: false,
  });
};

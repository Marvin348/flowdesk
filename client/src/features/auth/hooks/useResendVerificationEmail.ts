import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "@/features/auth/api/auth.api";

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
};

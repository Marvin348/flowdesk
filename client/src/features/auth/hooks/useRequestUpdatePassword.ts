import { useMutation } from "@tanstack/react-query";
import { requestUpdatePassword } from "@/features/auth/api/auth.api";

export const useRequestUpdatePassword = () => {
  return useMutation({
    mutationFn: requestUpdatePassword,
  });
};

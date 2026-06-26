import { useMutation} from "@tanstack/react-query";
import { verifyEmail } from "@/features/auth/api/auth.api";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth.api";
import type { AuthUser } from "@shared/types/user";

export const useCurrentUser = () => {
  const { data, isLoading, error } = useQuery<AuthUser, Error>({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return { data, isLoading, error };
};

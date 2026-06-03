import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth.api";
import type { User } from "@shared/types/user";

export const useCurrentUser = () => {
  const { data, isLoading, error } = useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return { data, isLoading, error };
};

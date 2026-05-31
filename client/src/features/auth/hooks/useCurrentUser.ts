import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth.api";

export const useCurrentUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false
  });

  return { data, isLoading, error };
};

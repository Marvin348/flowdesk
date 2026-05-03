import { fetchUserDetails } from "@/features/users/api/users.api.ts";
import type { UserDetailsDto } from "@shared/types/dto/user";
import { useQuery } from "@tanstack/react-query";

export const useUserDetails = (id: string) => {
  const { data, isLoading, error } = useQuery<UserDetailsDto, Error>({
    queryKey: ["users", id, "details"],
    queryFn: () => fetchUserDetails(id),
  });

  return { data, isLoading, error };
};

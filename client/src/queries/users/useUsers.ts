import { fetchUsers } from "@/api/users";
import type { User } from "@shared/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return { data, isLoading, error };
};

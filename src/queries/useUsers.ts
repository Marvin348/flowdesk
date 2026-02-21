import { fetchUsers } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  
  return { data, isLoading, error };
};

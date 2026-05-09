import { fetchProjectWorkload } from "@/features/projects/api/projects.api";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import { useQuery } from "@tanstack/react-query";

export const useProjectWorkload = (id: string) => {
  const { data, isLoading, error } = useQuery<UserWorkload[], Error>({
    queryKey: ["projects", id, "workload"],
    queryFn: () => fetchProjectWorkload(id),
  });

  return { data, isLoading, error };
};

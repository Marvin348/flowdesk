import { fetchProjects } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return { data, isLoading, error };
};

import { useProjects } from "@/queries/useProjects";

export const useCoreData = () => {
  const { data: projects = [], isLoading, error } = useProjects();

  return { projects, isLoading, error };
};

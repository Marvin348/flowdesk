import { useProjects } from "@/queries/projects/useProjects";

export const useCoreData = () => {
  const { data: projects = [], isLoading, error } = useProjects();

  return { projects, isLoading, error };
};

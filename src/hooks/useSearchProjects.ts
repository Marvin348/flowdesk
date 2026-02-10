import type { ProjectsWithMeta } from "@/type/projectsWithMeta";

export const useSearchProjects = (
  projectsWithMeta: ProjectsWithMeta[],
  searchQuery: string,
) =>
  projectsWithMeta.filter(
    (pro) =>
      !searchQuery ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

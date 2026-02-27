import type { ProjectsList } from "@/type/projectsList";

export const useSearchProjects = (
  projectsWithMeta: ProjectsList[],
  searchQuery: string,
) =>
  projectsWithMeta.filter(
    (pro) =>
      !searchQuery ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

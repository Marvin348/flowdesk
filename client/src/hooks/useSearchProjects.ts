import type { ProjectListVM } from "@/type/view-models/projectsList";

export const useSearchProjects = (
  projectList: ProjectListVM[],
  searchQuery: string,
) =>
  projectList.filter(
    (pro) =>
      !searchQuery ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

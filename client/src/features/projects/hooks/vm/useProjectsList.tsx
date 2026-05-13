import { useAppStore } from "@/store";
import type { ProjectListVM } from "@/features/projects/types/projectsList";
import type { ProjectSummariesDto } from "@shared/types/dto/projects/projectSummary.dto";

export const useProjectsListVM = (
  projects: ProjectSummariesDto[],
): ProjectListVM[] => {
  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const projectsList: ProjectListVM[] = projects.map((pro) => {
    const badge = badgeByProjectId[pro.id];

    return {
      ...pro,
      badge,
    };
  });

  return projectsList;
};

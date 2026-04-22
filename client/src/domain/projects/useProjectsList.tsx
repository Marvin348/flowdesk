import { useAppStore } from "@/store";
import { calcPercent } from "@/utils/calcPercent";
import type { ProjectListVM } from "@/type/view-models/projectsList";
import type { ProjectSummariesDto } from "@shared/types/dto/project";

export const useProjectsListVM = (
  projects: ProjectSummariesDto[],
): ProjectListVM[] => {
  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const projectsList: ProjectListVM[] = projects.map((pro) => {
    const badge = badgeByProjectId[pro.id];

    const progress = {
      total: pro.stats.taskCount,
      completed: pro.stats.completedTaskCount,
      percent: calcPercent(pro.stats.completedTaskCount, pro.stats.taskCount),
    };

    return {
      ...pro,
      badge,
      progress,
    };
  });

  return projectsList;
};

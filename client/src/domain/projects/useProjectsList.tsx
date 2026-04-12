import { useAppStore } from "@/store";
import { useProjectSummaries } from "@/queries/projects/useProjectSummaries";
import { calcPercent } from "@/utils/calcPercent";
import type { ProjectsListVM } from "@/type/view-models/projectsList";
import type { ProjectListVM } from "@/type/view-models/projectsList";

export const useProjectsListVM = (): ProjectsListVM => {
  const { data: projects, isLoading, error } = useProjectSummaries();

  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  if (!projects) {
    return {
      projects: [],
      isLoading,
      error,
    };
  }

  const projectsList = projects.map((pro): ProjectListVM => {
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

  return {
    projects: projectsList,
    isLoading,
    error,
  };
};

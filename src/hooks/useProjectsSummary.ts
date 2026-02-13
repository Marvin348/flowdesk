import type { ProjectsWithMeta } from "@/type/projectsWithMeta";

export type ProjectsSummary = {
  total: number;
  byBadges: {
    pinned: number;
    favorite: number;
    archived: number;
  };
  byStatus: {
    pending: number;
    in_progress: number;
    done: number;
  };
};

export const useProjectsSummary = (projectsWithMeta: ProjectsWithMeta[]) => {
  const total = projectsWithMeta.length;

  const projectSummary: ProjectsSummary = projectsWithMeta.reduce(
    (acc, project) => {
      if (project.badge) {
        acc.byBadges[project.badge] += 1;
      }

      acc.byStatus[project.status] += 1;

      return acc;
    },
    {
      total: 0,
      byBadges: {
        pinned: 0,
        favorite: 0,
        archived: 0,
      },
      byStatus: {
        pending: 0,
        in_progress: 0,
        done: 0,
      },
    },
  );

  projectSummary.total = total;

  return projectSummary;
};

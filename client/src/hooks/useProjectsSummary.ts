import type { ProjectListVM } from "@/type/view-models/projectsList";

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

export const useProjectsSummary = (projectList: ProjectListVM[]) => {
  const total = projectList.length;

  const projectSummary: ProjectsSummary = projectList.reduce(
    (acc, project) => {
      if (project.badge) {
        acc.byBadges[project.badge] += 1;
      }

      acc.byStatus[project.projectStatus] += 1;

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

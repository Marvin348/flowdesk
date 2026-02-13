import type { AppStore } from "@/store";
import type { StateCreator } from "zustand";

export type Badge = "favorite" | "pinned" | "archived";

type ProjectId = string;

type BadgeByProjectId = Record<ProjectId, Badge | undefined>;

export type ProjectBadgeSlice = {
  badgeByProjectId: BadgeByProjectId;
  toggleActiveBadge: (projectId: ProjectId, badge: Badge) => void;
};

export const createProjectBadgeSlice: StateCreator<
  AppStore,
  [],
  [],
  ProjectBadgeSlice
> = (set) => ({
  badgeByProjectId: {},

  toggleActiveBadge: (projectId, badge) =>
    set((state) => {
      const current = state.badgeByProjectId[projectId];

      return {
        badgeByProjectId: {
          ...state.badgeByProjectId,
          [projectId]: current === badge ? undefined : badge,
        },
      };
    }),
});

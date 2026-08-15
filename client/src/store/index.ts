import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilterSlice, type FilterSlice } from "@/store/slices/filter";
import type { ProjectBadgeSlice } from "@/store/slices/projectBadge";
import { createProjectBadgeSlice } from "@/store/slices/projectBadge";
import {
  createTaskModalSlice,
  type TaskModalSlice,
} from "@/store/slices/taskModel";
import {
  createProjectInviteSlice,
  type ProjectInviteModalSlice,
} from "@/store/slices/projectInvited";

export type AppStore = FilterSlice &
  ProjectBadgeSlice &
  TaskModalSlice &
  ProjectInviteModalSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createFilterSlice(...a),
      ...createProjectBadgeSlice(...a),
      ...createTaskModalSlice(...a),
      ...createProjectInviteSlice(...a),
    }),
    {
      name: "AppStore",
      partialize: (state) => ({
        badgeByProjectId: state.badgeByProjectId,
      }),
    },
  ),
);

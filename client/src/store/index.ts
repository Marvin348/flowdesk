import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilterSlice, type FilterSlice } from "@/store/slices/filter";
import type { ProjectBadgeSlice } from "@/store/slices/projectBadge";
import { createProjectBadgeSlice } from "@/store/slices/projectBadge";

export type AppStore = FilterSlice & ProjectBadgeSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createFilterSlice(...a),
      ...createProjectBadgeSlice(...a),
    }),
    {
      name: "AppStore",
      partialize: (state) => ({
        badgeByProjectId: state.badgeByProjectId,
      }),
    },
  ),
);

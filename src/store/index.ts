import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilterSlice, type FilterSlice } from "@/store/slices/filter";
import {
  createSearchQuerySlice,
  type SearchQuerySlice,
} from "@/store/slices/search";
import type { ProjectBadgeSlice } from "@/store/slices/projectBadge";
import { createProjectBadgeSlice } from "@/store/slices/projectBadge";

export type AppStore = FilterSlice & SearchQuerySlice & ProjectBadgeSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createFilterSlice(...a),
      ...createSearchQuerySlice(...a),
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

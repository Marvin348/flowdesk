import type { Priority } from "@/type/priority";
import type { TaskStatus } from "@/type/taskStatus";
import type { AppStore } from "@/store";
import type { StateCreator } from "zustand";

export type ProjectViewFilter = "all" | "favorite" | "pinned" | "archived";

export type ContentFilter = {
  priority?: Priority;
  status?: TaskStatus;
  hasAttachments?: boolean;
  view?: ProjectViewFilter;
};

export type FilterSlice = {
  filter: ContentFilter;
  setFilter: (filterOpt: Partial<ContentFilter>) => void;
  replaceFilter: (filterState: ContentFilter) => void;
  clearFilter: () => void;
};

export const defaultFilter: ContentFilter = {
  view: "all",
};

export const createFilterSlice: StateCreator<AppStore, [], [], FilterSlice> = (
  set,
) => ({
  filter: defaultFilter,
  setFilter: (filterOpt) =>
    set((state) => ({ filter: { ...state.filter, ...filterOpt } })),

  replaceFilter: (filterState) => set({ filter: filterState }),

  clearFilter: () => set({ filter: defaultFilter }),
});

import type { AppStore } from "@/store";
import type { StateCreator } from "zustand";
import type { ContentFilter } from "@shared/types/filter/contentFilter";

export type FilterSlice = {
  filter: ContentFilter;
  setFilter: (filterOpt: Partial<ContentFilter>) => void;
  replaceFilter: (filterState: ContentFilter) => void;
  hasActiveFilter: () => boolean;
  clearFilter: () => void;
};

export const defaultFilter: ContentFilter = {
  view: "all",
};

export const createFilterSlice: StateCreator<AppStore, [], [], FilterSlice> = (
  set,
  get,
) => ({
  filter: defaultFilter,
  setFilter: (filterOpt) =>
    set((state) => ({ filter: { ...state.filter, ...filterOpt } })),

  replaceFilter: (filterState) => set({ filter: filterState }),

  hasActiveFilter: () => {
    const { filter } = get();

    return Object.keys(filter).some((key) => {
      const typeKey = key as keyof ContentFilter;
      return filter[typeKey] !== defaultFilter[typeKey];
    });
  },

  clearFilter: () => set({ filter: defaultFilter }),
});

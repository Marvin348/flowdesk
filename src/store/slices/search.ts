import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type SearchQuerySlice = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};
export const createSearchQuerySlice: StateCreator<
  AppStore,
  [],
  [],
  SearchQuerySlice
> = (set) => ({
  searchQuery: "",
  setSearchQuery: (value) => set({ searchQuery: value }),
});

import { mockProjects } from "@/data/mockProjects";
import type { Project } from "@/type/project";
import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type ProjectsSlice = {
  projects: Project[];
};

export const createProjectsSlice: StateCreator<
  AppStore,
  [],
  [],
  ProjectsSlice
> = (set) => ({
  projects: mockProjects,
});

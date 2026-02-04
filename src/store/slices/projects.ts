import { mockProjects } from "@/mock/mockProjects";
import type { Project } from "@/type/Project";

export type ProjectsSlice = {
  projects: Project[];
};

export const createProjectsSlice = (set) => ({
  projects: mockProjects,
});

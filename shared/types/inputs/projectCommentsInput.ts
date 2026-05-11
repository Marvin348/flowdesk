import type { ProjectCommentsSort } from "../sort/projectCommentsSort.js";

export type ProjectCommentsInput = {
  projectId: string;
  limit: number;
  sort?: ProjectCommentsSort;
};

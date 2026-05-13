import type { ProjectCommentsSort } from "@shared/types/sort/projectCommentsSort.js";

export type ProjectCommentsQuery = {
  limit?: string;
  commentsSort?: ProjectCommentsSort;
};

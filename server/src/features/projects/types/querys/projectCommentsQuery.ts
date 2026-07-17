import type { ProjectCommentsSort } from "@shared/types/sort/projectCommentsSort";

export type ProjectCommentsQuery = {
  limit?: string;
  commentsSort?: ProjectCommentsSort;
};

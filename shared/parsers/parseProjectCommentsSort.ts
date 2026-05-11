import type { ProjectCommentsSort } from "../types/sort/projectCommentsSort";

export const parseProjectCommentsSort = (
  value?: string | null,
): ProjectCommentsSort | undefined =>
  value === "newest" || value === "oldest" ? value : undefined;

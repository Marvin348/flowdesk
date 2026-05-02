import type { ContentFilter } from "../filter/contentFilter.js";

export type ProjectSummariesInput = {
  search: string;
  filter?: ContentFilter
  page: number;
  limit: number;
};

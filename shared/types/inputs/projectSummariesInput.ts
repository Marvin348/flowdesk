import type { ContentFilter } from "../filter/contentFilter.js";
import type { Priority } from "../priority.js";
import type { StatusBase } from "../StatusBase.js";

export type ProjectSummariesInput = {
  search: string;
  filter?: ContentFilter
  // priority?: Priority;
  // status?: StatusBase;
  // hasAttachments?: boolean;
  page: number;
  limit: number;
};

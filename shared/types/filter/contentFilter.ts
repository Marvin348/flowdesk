import type { Priority } from "../priority.js";
import type { StatusBase } from "../StatusBase.js";

export type ProjectViewFilter = "all" | "favorite" | "pinned" | "archived";

export type ContentFilter = {
  priority?: Priority;
  status?: StatusBase;
  hasAttachments?: boolean;
  view?: ProjectViewFilter;
};

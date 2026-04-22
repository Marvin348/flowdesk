import type { ProjectSummaryQuery } from "@/types/querys/projectSummaryQuery.js";
import type { ContentFilter } from "@shared/types/filter/contentFilter.js";

export const parseProjectQueryFilter = (
  query: ProjectSummaryQuery,
): ContentFilter => {
  const { priority, status, hasAttachments } = query;

  return {
    priority:
      priority === "low" || priority === "medium" || priority === "high"
        ? priority
        : undefined,

    status:
      status === "pending" || status === "in_progress" || status === "done"
        ? status
        : undefined,

    hasAttachments:
      hasAttachments === "true"
        ? true
        : hasAttachments === "false"
          ? false
          : undefined,
  };
};

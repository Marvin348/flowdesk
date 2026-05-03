import type { CardView } from "@/features/projects/components/view-controls/ViewToggle";
import type { Priority } from "@shared/types/priority";
import type { StatusBase } from "@shared/types/StatusBase";

export const parseCardViewParam = (value: string | null): CardView =>
  value === "card" || value === "list" ? value : "card";

export const parsePriorityParam = (
  value: string | null,
): Priority | undefined =>
  value === "low" || value === "medium" || value === "high" ? value : undefined;

export const parseStatusParam = (
  value: string | null,
): StatusBase | undefined =>
  value === "pending" || value === "in_progress" || value === "done"
    ? value
    : undefined;

export const parseHasAttachmentsParam = (value: string | null) =>
  value === "true" ? true : value === "false" ? false : undefined;

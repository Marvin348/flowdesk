import type {
  TeamActivity,
  TeamProgress,
  TeamSort,
} from "@shared/types/teamFilter/teamFilter";
import type { UserRoleFilter } from "@shared/types/teamFilter/teamFilter";

export const parseUserRoleParam = (value: string | null): UserRoleFilter =>
  value === "admin" || value === "member" || value === "manager"
    ? value
    : "all";

export const parseSortParam = (value: string | null): TeamSort | undefined =>
  value === "name_asc" ||
  value === "name_desc" ||
  value === "openTasks_desc" ||
  value === "completedCount_desc"
    ? value
    : undefined;

export const parseProgressParam = (
  value: string | null,
): TeamProgress | undefined =>
  value === "critical" || value === "warning" || value === "good"
    ? value
    : undefined;

export const parseActivityParams = (
  value: string | null,
): TeamActivity | "all" =>
  value === "all" || value === "active" || value === "free" ? value : "all";

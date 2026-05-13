import type { ProjectCollaboratorSort } from "../types/sort/projectCollaboratorSort.js";

export const parseCollaboratorSort = (
  value?: string | null,
): ProjectCollaboratorSort | undefined =>
  value === "name_asc" ||
  value === "name_desc" ||
  value === "email_asc" ||
  value === "email_desc" ||
  value === "role_asc" ||
  value === "role_desc"
    ? value
    : undefined;

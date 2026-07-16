export type ProjectCollaboratorSort =
  (typeof PROJECT_COLLABORATOR_SORT)[number];

export const PROJECT_COLLABORATOR_SORT = [
  "name_asc",
  "name_desc",
  "email_asc",
  "email_desc",
  "role_asc",
  "role_desc",
] as const;

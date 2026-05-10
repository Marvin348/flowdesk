import { ProjectCollaboratorSort } from "@shared/types/sort/projectCollaboratorSort.js";
import { User } from "@shared/types/user.js";

export const sortedCollaborators = (
  collaborators: User[],
  sort?: ProjectCollaboratorSort,
) => {
  if (!sort) return collaborators;

  return [...collaborators].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.name.localeCompare(b.name);

      case "name_desc":
        return b.name.localeCompare(a.name);

      case "email_asc":
        return a.email.localeCompare(b.email);

      case "email_desc":
        return b.email.localeCompare(a.email);

      case "role_asc":
        return a.role.localeCompare(b.role);

      case "role_desc":
        return b.role.localeCompare(a.role);
    }
  });
};

import type { SortedByCollaborators } from "@/features/projects/components/projectDetailsPage/tabs/collaborators/CollaboratorsView";
import type { User } from "@shared/types/user";

export const getSortedCollaborators = (
  user: User[],
  sortedBy: SortedByCollaborators | null,
) => {
  if (!sortedBy) return user;

  return [...user].sort((a, b) => {
    let result = 0;

    if (sortedBy.sortKey === "name") {
      result = a.name.localeCompare(b.name);
    } else if (sortedBy.sortKey === "email") {
      result = a.email.localeCompare(b.email);
    } else if (sortedBy.sortKey === "type") {
      result = (a.role ?? "").localeCompare(b.role ?? "");
    }

    return sortedBy.sortDirection === "asc" ? result : -result;
  });
};

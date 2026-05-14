import { User, UserRole } from "@shared/types/user.js";

export const getFilteredUsers = (
  users: User[],
  search: string,
  role?: UserRole,
) =>
  users.filter((u) => {
    const searchQuery = search.toLowerCase();

    const matchesUserName = u.name.toLowerCase().includes(searchQuery);
    const matchesSearchUserRole = u.role.toLowerCase().includes(searchQuery);
    const matchesUserJob = u.jobTitle?.toLowerCase().includes(searchQuery);

    const matchesSearch =
      !search || matchesUserName || matchesSearchUserRole || matchesUserJob;

    const matchesUserRole = !role || u.role === role;

    return matchesSearch && matchesUserRole;
  });

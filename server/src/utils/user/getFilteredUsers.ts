import { User } from "@shared/types/user.js";

export const getFilteredUsers = (users: User[], search: string) =>
  users.filter((u) => {
    const searchQuery = search.toLowerCase();

    const matchesUserName = u.name.toLowerCase().includes(searchQuery);
    const matchesUserRole = u.role.toLowerCase().includes(searchQuery);
    const matchesUserJob = u.jobTitle?.toLowerCase().includes(searchQuery);

    return matchesUserName || matchesUserRole || matchesUserJob;
  });

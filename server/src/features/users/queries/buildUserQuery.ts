import type { UserRole } from "@shared/types/user.js";

type BuildUserQueryInput = {
  search: string;
  role?: UserRole;
};

export const buildUserQuery = ({ search, role }: BuildUserQueryInput) => {
  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  return query;
};

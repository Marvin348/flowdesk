import type { UserRole } from "@shared/types/user.js";

type BuildUserQueryInput = {
  search: string;
  role?: UserRole;
  workspaceId: string;
};

export const buildUserQuery = ({
  search,
  role,
  workspaceId,
}: BuildUserQueryInput) => {
  const query: Record<string, unknown> = { workspaceId };

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

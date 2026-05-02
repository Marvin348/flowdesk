import { TeamMembersQuery } from "@/routes/users.js";
import { TeamApiFilter } from "@shared/types/teamFilter/teamFilter.js";

export const parseTeamFilter = (query: TeamMembersQuery): TeamApiFilter => {
  const { role, sort, progress, activity } = query;

  return {
    role:
      role === "admin" || role === "member" || role === "manager"
        ? role
        : undefined,

    sort:
      sort === "name_asc" ||
      sort === "name_desc" ||
      sort === "openTasks_desc" ||
      sort === "completedCount_desc"
        ? sort
        : undefined,

    progress:
      progress === "critical" || progress === "warning" || progress === "good"
        ? progress
        : undefined,

    activity:
      activity === "active" || activity === "free" ? activity : undefined,
  };
};

import { TeamMemberDto } from "@shared/types/dto/user.js";
import { TeamSort } from "@shared/types/teamFilter/teamFilter.js";

export const sortTeamMembers = (
  teamMembers: TeamMemberDto[],
  sort?: TeamSort,
) => {
  return [...teamMembers].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.name.localeCompare(b.name);

      case "name_desc":
        return b.name.localeCompare(a.name);

      case "completedCount_desc":
        return b.stats.completedCount - a.stats.completedCount;

      case "openTasks_desc":
        return b.stats.openTasks - a.stats.openTasks;

        default: 
        return 0;
    }
  });
};

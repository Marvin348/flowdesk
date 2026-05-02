import type { TeamMemberDto } from "@shared/types/dto/user.js";
import type { TeamApiFilter } from "@shared/types/teamFilter/teamFilter.js";
import { getStatusFromProgress } from "@shared/utils/getStatusFromProgress.js";

export const getFilteredTeamMembers = (
  teamMembers: TeamMemberDto[],
  filter?: TeamApiFilter,
) =>
  teamMembers.filter((t) => {
    const progressStatus = getStatusFromProgress(t.stats.progressPercent);

    const matchesProgress =
      !filter?.progress || progressStatus === filter.progress;

    let matchesActivity = true;

    const free = t.stats.openTasks === 0;
    const active = t.stats.openTasks > 0; // vllt 3 oder 4?

    if (filter?.activity === "active") matchesActivity = active;
    if (filter?.activity === "free") matchesActivity = free;

    return matchesProgress && matchesActivity;
  });

import type { TeamMembersQueryParams } from "@/features/users/validators/teamMembersQuerySchema.validator.js";
import type { PipelineStage } from "mongoose";

export const buildTeamMembersSortStage = (
  sort: TeamMembersQueryParams["sort"],
): PipelineStage.Sort["$sort"] => {
  switch (sort) {
    case "name_desc":
      return { name: -1 };

    case "openTasks_desc":
      return { openTasks: -1 };

    case "completedCount_desc":
      return { completedCount: -1 };

    case "name_asc":
    default:
      return { name: 1 };
  }
};

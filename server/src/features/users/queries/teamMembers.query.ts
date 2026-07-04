import { UserRole } from "@shared/types/user.js";
import { Types } from "mongoose";

type BuildTeamMembersMatchStageInput = {
  search: string;
  role?: UserRole;
  workspaceId: Types.ObjectId;
};
export const buildTeamMembersMatchStage = ({
  search,
  role,
  workspaceId,
}: BuildTeamMembersMatchStageInput) => {

  return {
    workspaceId,
    ...(role && { role }),
    ...(search && {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
      ],
    }),
  };
};

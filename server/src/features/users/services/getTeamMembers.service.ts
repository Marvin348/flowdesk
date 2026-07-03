import { UserModel } from "@/features/users/models/user.modal.js";
import { TeamMembersQueryParams } from "@/features/users/validators/teamMembersQuerySchema.validator.js";
import mongoose from "mongoose";
import { toTeamMemberDto } from "@/features/users/mappers/toTeamMember.mapper.js";
import { buildTeamMembersPipeline } from "@/features/users/queries/teamMembers.pipeline.js";
import { TeamMembersResponseDto } from "@shared/types/dto/users/user.js";

type GetTeamMembersInput = {
  query: TeamMembersQueryParams;
  workspaceId: string;
};

export const getTeamMembers = async ({
  query,
  workspaceId,
}: GetTeamMembersInput): Promise<TeamMembersResponseDto> => {
  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

  const pipeline = buildTeamMembersPipeline({
    workspaceId: workspaceObjectId,
    query,
  });

  const [result] = await UserModel.aggregate(pipeline);

  const totalItems = result.metadata[0]?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / query.limit);

  return {
    items: result.data.map(toTeamMemberDto),
    pagination: {
      currentPage: query.page,
      totalPages,
    },
  };
};

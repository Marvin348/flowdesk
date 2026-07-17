import { UserModel } from "@/features/users/models/user.modal";
import { TeamMembersQueryParams } from "@/features/users/validators/teamMembersQuerySchema.validator";
import { Types } from "mongoose";
import { toTeamMemberDto } from "@/features/users/mappers/toTeamMember.mapper";
import { buildTeamMembersPipeline } from "@/features/users/queries/teamMembers.pipeline";
import { TeamMembersResponseDto } from "@shared/types/dto/users/user";

type GetTeamMembersInput = {
  query: TeamMembersQueryParams;
  workspaceId: Types.ObjectId;
};

export const getTeamMembers = async ({
  query,
  workspaceId,
}: GetTeamMembersInput): Promise<TeamMembersResponseDto> => {
  const pipeline = buildTeamMembersPipeline({
    workspaceId,
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

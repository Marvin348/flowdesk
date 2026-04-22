import { fetchTeamMembers } from "@/api/users";
import type { TeamMembersInput } from "@shared/types/inputs/teamMemberInput";
import type { TeamMembersResponseDto } from "@shared/types/dto/user";
import { useQuery } from "@tanstack/react-query";

export const useTeamMembers = (input: TeamMembersInput) => {
  const { data, isLoading, error } = useQuery<TeamMembersResponseDto, Error>({
    queryKey: ["users", "team", input.search, input.page, input.limit],
    queryFn: () => fetchTeamMembers(input),
    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, error };
};

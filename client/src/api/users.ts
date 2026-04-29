import type { User } from "@shared/types/user";
import { apiClient } from "@/api/client";
import type { ChangeUserRoleInput } from "@shared/types/inputs/changeUserRoleInput";
import type {
  TeamMembersResponseDto,
  UserDetailsDto,
} from "@shared/types/dto/user";
import type { TeamMembersInput } from "@shared/types/inputs/teamMemberInput";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await apiClient.get("/users");
  return res.data.data;
};

export const fetchTeamMembers = async (
  input: TeamMembersInput,
): Promise<TeamMembersResponseDto> => {
  const res = await apiClient.get(
    `/users/team?search=${input.search}&page=${input.page}&limit=${input.limit}`,
  );
  return res.data.data;
};

export const fetchUserDetails = async (id: string): Promise<UserDetailsDto> => {
  const res = await apiClient.get(`/users/${id}/details`);
  return res.data.data;
};

// old
export const changeUserRole = async (
  input: ChangeUserRoleInput,
): Promise<User> => {
  const res = await apiClient.patch(`/users/${input.id}`, {
    role: input.role,
  });
  return res.data;
};

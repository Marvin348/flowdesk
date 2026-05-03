import type { User } from "@shared/types/user";
import { apiClient } from "@/shared/api/client";
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
  const params = new URLSearchParams({
    search: input.search,
    page: String(input.page),
    limit: String(input.limit),
  });

  if (input.filter?.role && input.filter.role !== "all") {
    params.set("role", input.filter.role);
  }
  if (input.filter?.activity && input.filter.activity !== "all") {
    params.set("activity", input.filter.activity);
  }

  if (input.filter?.sort) params.set("sort", input.filter.sort);
  if (input.filter?.progress) params.set("progress", input.filter.progress);

  const res = await apiClient.get(`/users/team?${params.toString()}`);
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

import type { AuthUser, User } from "@shared/types/user";
import { apiClient } from "@/shared/api/client";
import type { ChangeUserRoleInput } from "@shared/types/inputs/changeUserRoleInput";
import type {
  TeamMembersResponseDto,
  UserDetailsDto,
} from "@shared/types/dto/users/user";
import type { TeamMembersInput } from "@shared/types/inputs/teamMemberInput";
import type { UpdateUserProfileInput } from "@/features/users/types/updateUserProfile";
import type { UpdateAppearanceSettingsInput } from "@/features/users/types/UpdateAppearanceSettings";
import type { UserAvatarDto } from "@shared/types/dto/common/userPreview.dto";
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

export const changeUserRole = async (
  input: ChangeUserRoleInput,
): Promise<User> => {
  const res = await apiClient.patch(`/users/${input.id}`, {
    role: input.role,
  });
  return res.data;
};

export const updateUserProfile = async (
  input: UpdateUserProfileInput,
): Promise<User> => {
  const res = await apiClient.patch("/users/me", input);
  return res.data.user;
};

export const updateAppearanceSettings = async (
  input: UpdateAppearanceSettingsInput,
): Promise<AuthUser> => {
  const res = await apiClient.patch("/users/appearance", input);
  return res.data.user;
};

export const uploadAvatar = async (avatar: File): Promise<UserAvatarDto> => {
  const formData = new FormData();

  formData.append("avatar", avatar);

  const res = await apiClient.patch("/users/me/avatar", formData);
  return res.data.uploadedAvatar;
};

export const deleteAvatar = async () => {
  const res = await apiClient.delete("/users/me/avatar");
  return res.data.message;
};

import { apiClient } from "@/shared/api/client";
import type { UpdateProjectMembersInput } from "@shared/types/inputs/updateProjectMembersInput";
import type { DeleteProjectMemberInput } from "@shared/types/inputs/deleteProjectMemberInput";

export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
) => {
  const res = await apiClient.patch(
    `/projects/${input.projectId}/members`,
    input,
  );
  return res.data.message;
};

export const deleteProjectMember = async (input: DeleteProjectMemberInput) => {
  const res = await apiClient.delete(
    `/projects/${input.projectId}/members/${input.userId}`,
  );
  return res.data.message;
};

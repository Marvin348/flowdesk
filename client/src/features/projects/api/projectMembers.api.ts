import { apiClient } from "@/shared/api/client";
import type { Project } from "@shared/types/project";
import type { AssignUserToProjectsInput } from "@shared/types/inputs/assignUserToProjectsInput";
import type { UpdateProjectMembersInput } from "@shared/types/inputs/updateProjectMembersInput";
import type { DeleteProjectMemberInput } from "@shared/types/inputs/deleteProjectMemberInput";

export const assignUserToProjects = async (
  input: AssignUserToProjectsInput,
): Promise<Project[]> => {
  const res = await apiClient.patch("/projects/assign-user", input);
  return res.data.data;
};

export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
): Promise<Project> => {
  const res = await apiClient.patch(
    `/projects/${input.projectId}/members`,
    input,
  );
  return res.data.data;
};

export const deleteProjectMember = async (input: DeleteProjectMemberInput) => {
  const res = await apiClient.delete(
    `/projects/${input.projectId}/members/${input.userId}`,
  );
  return res.data.data;
};

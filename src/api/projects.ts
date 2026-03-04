import { apiClient } from "@/api/client";
import type { Project } from "@/type/project";

export type UpdateProjectMembersInput = {
  projectId: string;
  invitedUserIds: string[];
  updatedAt?: string;
};

export const fetchProjects = async (id?: string): Promise<Project[]> => {
  const url = id ? `/projects?id=${id}` : "/projects";
  const res = await apiClient.get(url);
  return res.data;
};

export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
): Promise<Project> => {
  const res = await apiClient.patch(`/projects/${input.projectId}`, {
    invitedUserIds: input.invitedUserIds,
    updatedAt: new Date().toISOString(),
  });
  return res.data;
};

// const fetchJobs = async () => {
//   try {
//     const res = await fetch("https.....");
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

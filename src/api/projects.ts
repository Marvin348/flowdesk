import { apiClient } from "@/api/client";
import type { Project } from "@/type/domain/project";
import type { CreateProjectInput } from "@/type/inputs/createProjectInput";

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

export const createProject = async (
  input: CreateProjectInput,
): Promise<Project> => {
  const res = await apiClient.post(`/projects`, {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    priority: input.priority,
    projectStatus: input.projectStatus,
    dueDate: input.dueDate,
    invitedUserIds: input.invitedUserIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return res.data;
};

export const deleteProject = async (id: string): Promise<Project> => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};

// OHNE axios
// const createProject = async (input: CreateProjectInput): Promise<Project> => {
//   const response = await fetch("http://localhost:30001/projects", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       id: crypto.randomUUID(),
//       title: input.title,
//       description: input.description,
//       priority: input.priority,
//       projectStatus: input.projectStatus,
//       dueDate: input.dueDate,
//       invitedUserIds: input.invitedUserIds,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("response was not ok");
//   }

//   return await response.json();
// };

////////////////////////////////////////////////////////////////////
// const fetchJobs = async () => {
//   try {
//     const res = await fetch("https.....");
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

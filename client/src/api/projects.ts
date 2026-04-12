import { apiClient } from "@/api/client";
import type { Project } from "@/type/domain/project";
import type { CreateProjectInput } from "@/type/inputs/createProjectInput";
import type { ProjectSummaryDto } from "@/type/view-models/projectsList";
import type { ProjectDetails } from "@/type/view-models/projectsWithMeta";

export type UpdateProjectMembersInput = {
  projectId: string;
  userIdsToAdd: string[];
};

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data.data;
};

// export const fetchProjects = async (id?: string): Promise<Project[]> => {
//   const url = id ? `/projects?id=${id}` : "/projects";
//   const res = await apiClient.get(url);
//   return res.data;
// };

// new
export const fetchProject = async (id: string): Promise<Project> => {
  const res = await apiClient.get(`/projects/${id}`);
  return res.data;
};

// new details with all endpoints
export const fetchProjectDetails = async (
  id: string,
): Promise<ProjectDetails> => {
  const res = await apiClient.get(`/projects/${id}/details`);
  return res.data.data;
};

// list vm
export const fetchProjectList = async () => {
  const res = await apiClient.get("/projects/list");

  return res.data.data;
};

export const fetchProjectSummaries = async (): Promise<ProjectSummaryDto[]> => {
  const res = await apiClient.get("/projects/summary");

  return res.data.data;
};

export const createProject = async (
  input: CreateProjectInput,
): Promise<Project> => {
  const res = await apiClient.post(`/projects`, input);

  return res.data.data;
};

// old
export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
): Promise<Project> => {
  const res = await apiClient.patch(`/projects/${input.projectId}`, input);

  return res.data.data;
};

// old
export const deleteProject = async (id: string): Promise<Project> => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};

import { apiClient } from "@/api/client";
import type { Project } from "@/type/domain/project";
import type { CreateProjectInput } from "@/type/inputs/createProjectInput";
import axios from "axios";
import type { ProjectDetails } from "@/type/view-models/projectsWithMeta";

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

// new
export const fetchProject = async (id: string): Promise<Project> => {
  const res = await axios.get(`http://localhost:3001/projects/${id}`);
  return res.data;
};

// new details with all endpoints
export const fetchProjectDetails = async (
  id: string,
): Promise<ProjectDetails> => {
  const res = await axios.get(`http://localhost:3001/projects/${id}/details`);
  return res.data.data;
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

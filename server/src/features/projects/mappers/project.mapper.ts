import type { Project } from "@shared/types/project.js";

type ProjectDbRecord = Omit<Project, "createdAt" | "updatedAt" | "dueDate"> & {
  _id?: unknown;
  __v?: number;
  dueDate: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
};

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toProjectDto = (project: ProjectDbRecord): Project => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    priority: project.priority,
    projectStatus: project.projectStatus,
    dueDate: toIsoString(project.dueDate),
    invitedUserIds: project.invitedUserIds,
    createdAt: toIsoString(project.createdAt),
    updatedAt: project.updatedAt ? toIsoString(project.updatedAt) : undefined,
  };
};

export const toProjectDtos = (projects: ProjectDbRecord[]): Project[] => {
  return projects.map(toProjectDto);
};

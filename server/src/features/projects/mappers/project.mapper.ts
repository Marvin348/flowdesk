import type { Project } from "@shared/types/project";
import type { ProjectDocument } from "@/features/projects/types/project.document";

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toProjectDto = (project: ProjectDocument): Project => {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    ownerId: project.ownerId,
    priority: project.priority,
    projectStatus: project.projectStatus,
    dueDate: toIsoString(project.dueDate),
    invitedUserIds: project.invitedUserIds.map((id) => id.toString()),
    createdAt: toIsoString(project.createdAt),
    updatedAt: project.updatedAt ? toIsoString(project.updatedAt) : undefined,
  };
};

export const toProjectDtos = (projects: ProjectDocument[]): Project[] => {
  return projects.map(toProjectDto);
};

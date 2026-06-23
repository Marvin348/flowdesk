import { CreateProjectFields } from "@/features/projects/validation/project.validator.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { createActivity } from "@/features/activity/services/createActivity.service.js";

type CreateProjectInput = {
  input: CreateProjectFields;
  workspaceId: string;
  userId: string;
};

export const createProject = async ({
  input,
  workspaceId,
  userId,
}: CreateProjectInput) => {
  const {
    title,
    dueDate,
    projectStatus,
    priority,
    invitedUserIds,
    description,
  } = input;

  const newProject = await ProjectModel.create({
    workspaceId,
    title,
    priority,
    ownerId: userId,
    projectStatus,
    dueDate,
    invitedUserIds,
    description,
  });

  await createActivity({
    workspaceId,
    actorId: userId,
    type: "project.created",
    entityType: "project",
    entityId: newProject._id.toString(),
    metadata: {
      projectTitle: newProject.title,
      projectStatus: newProject.projectStatus,
      priority: newProject.priority,
    },
  });

  return toProjectDto(newProject.toObject());
};

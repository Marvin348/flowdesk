import { ProjectModel } from "@/features/projects/models/project.model";
import { requireMappedId } from "@/scripts/seed/seedUtils";
import type { SeedProject } from "@/scripts/seed/types";
import { Types } from "mongoose";

type SeedProjectInput = {
  projects: SeedProject[];
  userIdMap: Map<string, string>;
  workspaceId: Types.ObjectId;
};

export const seedProjects = async ({
  projects,
  userIdMap,
  workspaceId,
}: SeedProjectInput) => {
  const projectIdMap = new Map<string, string>();

  const demoUserId = requireMappedId(userIdMap, "demo-user", "project.ownerId");

  for (const project of projects) {
    const createdProject = await ProjectModel.create({
      title: project.title,
      description: project.description,
      priority: project.priority,
      projectStatus: project.projectStatus,
      dueDate: project.dueDate,

      ownerId: demoUserId,
      workspaceId,

      invitedUserIds: project.invitedUserIds.map((userId) =>
        requireMappedId(userIdMap, userId, "project.invitedUserIds"),
      ),

      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });

    projectIdMap.set(project.id, createdProject._id.toString());
  }

  return projectIdMap;
};

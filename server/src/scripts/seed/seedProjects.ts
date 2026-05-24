import { ProjectModel } from "@/features/projects/models/project.model.js";
import { requireMappedId } from "@/scripts/seed/seedUtils.js";
import type { SeedProject } from "@/scripts/seed/types.js";

export const seedProjects = async (
  projects: SeedProject[],
  userIdMap: Map<string, string>,
) => {
  const projectIdMap = new Map<string, string>();

  for (const project of projects) {
    const createdProject = await ProjectModel.create({
      title: project.title,
      description: project.description,
      priority: project.priority,
      projectStatus: project.projectStatus,
      dueDate: project.dueDate,

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

import { ProjectModel } from "@/features/projects/models/project.model.js";

export const touchProject = async (projectId: string) => {
  await ProjectModel.findOneAndUpdate(
    { id: projectId },
    { updatedAt: new Date() },
  );
};

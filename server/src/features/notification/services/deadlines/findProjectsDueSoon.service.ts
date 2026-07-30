import { ProjectModel } from "@/features/projects/models/project.model";

export const findProjectsDueSoon = async () => {
  const now = new Date();
  const dueSoonUntil = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  return ProjectModel.find({
    dueDate: {
      $gt: now,
      $lte: dueSoonUntil,
    },
    projectStatus: {
      $ne: "done",
    },
    invitedUserIds: {
      $ne: [],
    },
  }).select("_id workspaceId dueDate invitedUserIds")
    .lean();
};

import { TaskModel } from "@/features/tasks/models/task.model";

export const findTasksDueSoon = async () => {
  const now = new Date();
  const dueSoonUntil = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  return await TaskModel.find({
    dueDate: {
      $gt: now,
      $lte: dueSoonUntil,
    },
    taskStatus: {
      $ne: "done",
    },
    collaboratorIds: {
      $ne: [],
    },
  })
    .select("_id workspaceId projectId dueDate collaboratorIds")
    .lean();
};

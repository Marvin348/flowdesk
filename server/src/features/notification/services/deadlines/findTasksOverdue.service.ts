import { TaskModel } from "@/features/tasks/models/task.model";

export const findTasksOverdue = async () => {
  const now = new Date();
  const overdueSince = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  return await TaskModel.find({
    dueDate: {
      $gte: overdueSince,
      $lt: now,
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

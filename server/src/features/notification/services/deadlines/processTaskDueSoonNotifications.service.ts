import { findTasksDueSoon } from "@/features/notification/services/deadlines/findTasksDueSoon.service";
import { notificationQueue } from "@/queues/notificationQueue";

export const processTaskDueSoonNotifications = async () => {
  const tasks = await findTasksDueSoon();

  for (const task of tasks) {
    await notificationQueue.add("task-due-soon", {
      workspaceId: task.workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: task.projectId.toString(),
      collaboratorIds: task.collaboratorIds.map((id) => id.toString()),
      deadlineAt: task.dueDate.toISOString(),
    });
  }
};

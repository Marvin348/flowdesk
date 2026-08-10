import { findTasksOverdue } from "@/features/notification/services/deadlines/findTasksOverdue.service";
import { notificationQueue } from "@/queues/notificationQueue";

export const processTaskOverdueNotifications = async () => {
  const tasks = await findTasksOverdue();

  for (const task of tasks) {
    await notificationQueue.add("task-overdue", {
      workspaceId: task.workspaceId.toString(),
      taskId: task._id.toString(),
      projectId: task.projectId.toString(),
      collaboratorIds: task.collaboratorIds.map((id) => id.toString()),
      deadlineAt: task.dueDate.toISOString(),
    });
  }
};

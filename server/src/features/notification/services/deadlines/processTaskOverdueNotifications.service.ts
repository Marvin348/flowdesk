import { findTasksOverdue } from "@/features/notification/services/deadlines/findTasksOverdue.service";
import { createDeadlineNotification } from "@/features/notification/services/deadlines/createDeadlineNotification.service";

export const processTaskOverdueNotifications = async () => {
  const tasks = await findTasksOverdue();

  for (const task of tasks) {
    for (const recipientId of task.collaboratorIds) {
      await createDeadlineNotification({
        workspaceId: task.workspaceId,
        recipientId,
        entityId: task._id,
        projectId: task.projectId,
        type: "task_overdue",
        entityType: "task",
        deadlineAt: task.dueDate,
      });
    }
  }
};

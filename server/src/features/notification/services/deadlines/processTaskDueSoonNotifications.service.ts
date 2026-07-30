import { findTasksDueSoon } from "@/features/notification/services/deadlines/findTasksDueSoon.service";
import { createDeadlineNotification } from "@/features/notification/services/deadlines/createDeadlineNotification.service";

export const processTaskDueSoonNotifications = async () => {
  const tasks = await findTasksDueSoon();

  for (const task of tasks) {
    for (const recipientId of task.collaboratorIds) {
      await createDeadlineNotification({
        workspaceId: task.workspaceId,
        recipientId,
        entityId: task._id,
        projectId: task.projectId,
        type: "task_due_soon",
        entityType: "task",
        deadlineAt: task.dueDate,
      });
    }
  }
};

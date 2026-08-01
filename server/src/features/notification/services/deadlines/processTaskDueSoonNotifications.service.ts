import { findTasksDueSoon } from "@/features/notification/services/deadlines/findTasksDueSoon.service";
import { createNotification } from "@/features/notification/services/createNotification.service";


export const processTaskDueSoonNotifications = async () => {
  const tasks = await findTasksDueSoon();

  for (const task of tasks) {
    for (const recipientId of task.collaboratorIds) {
      await createNotification({
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

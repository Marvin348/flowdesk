import { findTasksOverdue } from "@/features/notification/services/deadlines/findTasksOverdue.service";
import { createNotification } from "@/features/notification/services/createNotification.service";


export const processTaskOverdueNotifications = async () => {
  const tasks = await findTasksOverdue();

  for (const task of tasks) {
    for (const recipientId of task.collaboratorIds) {
      await createNotification({
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

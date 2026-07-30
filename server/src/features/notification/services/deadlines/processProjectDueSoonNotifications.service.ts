import { createDeadlineNotification } from "@/features/notification/services/deadlines/createDeadlineNotification.service";
import { findProjectsDueSoon } from "@/features/notification/services/deadlines//findProjectsDueSoon.service";

export const processProjectDueSoonNotifications = async () => {
  const projects = await findProjectsDueSoon();

  for (const project of projects) {
    for (const recipientId of project.invitedUserIds) {
      await createDeadlineNotification({
        workspaceId: project.workspaceId,
        recipientId,
        entityId: project._id,
        type: "project_due_soon",
        entityType: "project",
        deadlineAt: project.dueDate
      })
    }
  }
};

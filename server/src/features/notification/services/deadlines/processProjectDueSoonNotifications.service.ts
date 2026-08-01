import { findProjectsDueSoon } from "@/features/notification/services/deadlines//findProjectsDueSoon.service";
import { createNotification } from "@/features/notification/services/createNotification.service";

export const processProjectDueSoonNotifications = async () => {
  const projects = await findProjectsDueSoon();

  for (const project of projects) {
    for (const recipientId of project.invitedUserIds) {
      await createNotification({
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

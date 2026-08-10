import { findProjectsDueSoon } from "@/features/notification/services/deadlines/findProjectsDueSoon.service";
import { notificationQueue } from "@/queues/notificationQueue";

export const processProjectDueSoonNotifications = async () => {
  const projects = await findProjectsDueSoon();

  for (const project of projects) {
    await notificationQueue.add("project-due-soon", {
      workspaceId: project.workspaceId.toString(),
      projectId: project._id.toString(),
      invitedUserIds: project.invitedUserIds.map((id) => id.toString()),
      deadlineAt: project.dueDate.toISOString(),
    });
  }
};

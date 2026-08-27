import { createNotification } from "@/features/notification/services/createNotification.service";
import { Types } from "mongoose";
import { publishRealtimeNotification } from "@/features/notification/handlers/publishRealtimeNotification";

type HandleTaskDueSoonNotificationsInput = {
  workspaceId: string;
  taskId: string;
  projectId: string;
  collaboratorIds: string[];
  deadlineAt: string;
};

export const handleTaskDueSoonNotifications = async ({
  workspaceId,
  taskId,
  projectId,
  collaboratorIds,
  deadlineAt,
}: HandleTaskDueSoonNotificationsInput) => {
  const taskObjectIs = new Types.ObjectId(taskId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const projectObjectId = new Types.ObjectId(projectId);

  const collaboratorObjectIds = collaboratorIds.map(
    (id) => new Types.ObjectId(id),
  );

  for (const recipientId of collaboratorObjectIds) {
    await createNotification({
      workspaceId: workspaceObjectId,
      recipientId,
      entityId: taskObjectIs,
      projectId: projectObjectId,
      type: "task_due_soon",
      entityType: "task",
      deadlineAt: new Date(deadlineAt),
    });
  }

  await publishRealtimeNotification(collaboratorIds);
};

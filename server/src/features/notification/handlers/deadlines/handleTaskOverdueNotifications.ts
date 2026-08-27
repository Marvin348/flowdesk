import { createNotification } from "@/features/notification/services/createNotification.service";
import { Types } from "mongoose";
import { publishRealtimeNotification } from "@/features/notification/handlers/publishRealtimeNotification";

type HandleTaskOverdueNotificationsInput = {
  workspaceId: string;
  taskId: string;
  projectId: string;
  collaboratorIds: string[];
  deadlineAt: string;
};

export const handleTaskOverdueNotifications = async ({
  workspaceId,
  taskId,
  projectId,
  collaboratorIds,
  deadlineAt,
}: HandleTaskOverdueNotificationsInput) => {
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
      type: "task_overdue",
      entityType: "task",
      deadlineAt: new Date(deadlineAt),
    });
  }

  await publishRealtimeNotification(collaboratorIds);
};

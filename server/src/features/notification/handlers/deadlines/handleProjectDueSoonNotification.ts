import { createNotification } from "@/features/notification/services/createNotification.service";
import { Types } from "mongoose";
import { publishRealtimeNotification } from "@/features/notification/handlers/publishRealtimeNotification";

type HandleProjectDueSoonNotificationInput = {
  workspaceId: string;
  projectId: string;
  invitedUserIds: string[];
  deadlineAt: string;
};

export const handleProjectDueSoonNotification = async ({
  workspaceId,
  projectId,
  invitedUserIds,
  deadlineAt,
}: HandleProjectDueSoonNotificationInput) => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const projectObjectId = new Types.ObjectId(projectId);

  const invitedUsersObjectIds = invitedUserIds.map(
    (id) => new Types.ObjectId(id),
  );

  for (const recipientId of invitedUsersObjectIds) {
    await createNotification({
      workspaceId: workspaceObjectId,
      recipientId,
      entityId: projectObjectId,
      type: "project_due_soon",
      entityType: "project",
      deadlineAt: new Date(deadlineAt),
    });
  }

  await publishRealtimeNotification(invitedUserIds);
};

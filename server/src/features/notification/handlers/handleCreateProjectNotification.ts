import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type CreateProjectNotificationInput = {
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  projectId: Types.ObjectId;
  invitedUserIds: Types.ObjectId[];
};
export const handleCreateProjectNotification = async ({
  workspaceId,
  actorId,
  projectId,
  invitedUserIds,
}: CreateProjectNotificationInput) => {
  const recipientIds = invitedUserIds.filter((id) => !id.equals(actorId));

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId,
        recipientId,
        actorId,
        type: "project_assigned",
        entityType: "project",
        entityId: projectId,
      }),
    ),
  );
};

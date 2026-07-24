import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type TaskUpdatedNotificationInput = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  taskId: Types.ObjectId;
  projectId: Types.ObjectId;
  previousCollaboratorIds: Types.ObjectId[];
  currentCollaboratorIds: Types.ObjectId[];
};

export const handleTaskUpdatedNotification = async ({
  actorId,
  workspaceId,
  taskId,
  projectId,
  previousCollaboratorIds,
  currentCollaboratorIds,
}: TaskUpdatedNotificationInput) => {
  const addedCollaboratorIds = currentCollaboratorIds.filter(
    (newId) => !previousCollaboratorIds.some((oldId) => oldId.equals(newId)),
  );

  const recipientIds = addedCollaboratorIds.filter((id) => !id.equals(actorId));

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId,
        recipientId,
        actorId,
        type: "task_assigned",
        entityType: "task",
        entityId: taskId,
        projectId,
      }),
    ),
  );
};

import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type TaskUpdatedNotificationInput = {
  actorId: string;
  workspaceId: string;
  taskId: string;
  projectId: string;
  previousCollaboratorIds: string[];
  currentCollaboratorIds: string[];
};

export const handleTaskUpdatedNotification = async ({
  actorId,
  workspaceId,
  taskId,
  projectId,
  previousCollaboratorIds,
  currentCollaboratorIds,
}: TaskUpdatedNotificationInput) => {
  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const taskObjectId = new Types.ObjectId(taskId);
  const projectObjectId = new Types.ObjectId(projectId);
  
  const addedCollaboratorIds = currentCollaboratorIds.filter(
    (newId) => !previousCollaboratorIds.some((oldId) => oldId === newId),
  );

  const recipientIds = addedCollaboratorIds.filter((id) => id !== actorId);

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId: workspaceObjectId,
        recipientId: new Types.ObjectId(recipientId),
        actorId: actorObjectId,
        type: "task_assigned",
        entityType: "task",
        entityId: taskObjectId,
        projectId: projectObjectId,
      }),
    ),
  );
};

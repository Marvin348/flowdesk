import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleTaskCreatedNotification = {
  actorId: string;
  workspaceId: string;
  taskId: string;
  projectId: string;
  collaboratorIds: string[];
};
export const handleTaskCreatedNotification = async ({
  actorId,
  workspaceId,
  taskId,
  projectId,
  collaboratorIds,
}: HandleTaskCreatedNotification) => {
  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const taskObjectId = new Types.ObjectId(taskId);
  const projectObjectId = new Types.ObjectId(projectId);
  
  const recipientIds = collaboratorIds.filter((id) => id !== actorId);

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId: workspaceObjectId,
        actorId: actorObjectId,
        recipientId: new Types.ObjectId(recipientId),
        type: "task_assigned",
        entityType: "task",
        entityId: taskObjectId,
        projectId: projectObjectId,
      }),
    ),
  );
};

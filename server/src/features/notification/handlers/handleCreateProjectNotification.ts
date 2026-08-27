import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";
import { redisClient } from "@/shared/config/redis";
import { publishRealtimeNotification } from "./publishRealtimeNotification";

type CreateProjectNotificationInput = {
  workspaceId: string;
  actorId: string;
  projectId: string;
  invitedUserIds: string[];
};
export const handleCreateProjectNotification = async ({
  workspaceId,
  actorId,
  projectId,
  invitedUserIds,
}: CreateProjectNotificationInput) => {
  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const projectObjectId = new Types.ObjectId(projectId);

  const recipientIds = invitedUserIds.filter((id) => id !== actorId);

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        workspaceId: workspaceObjectId,
        recipientId: new Types.ObjectId(recipientId),
        actorId: actorObjectId,
        type: "project_assigned",
        entityType: "project",
        entityId: projectObjectId,
      }),
    ),
  );

  await publishRealtimeNotification(recipientIds);
};

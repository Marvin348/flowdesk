import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";
import { publishRealtimeNotification } from "./publishRealtimeNotification";

type ProjectMembersAddedNotification = {
  workspaceId: string;
  actorId: string;
  projectId: string;
  addedUserIds: string[];
};

export const handleProjectMembersAddedNotification = async ({
  workspaceId,
  actorId,
  projectId,
  addedUserIds,
}: ProjectMembersAddedNotification) => {
  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const projectObjectId = new Types.ObjectId(projectId);

  const recipientIds = addedUserIds.filter((id) => id !== actorId);

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

import { Types } from "mongoose";
import { createNotification } from "../services/createNotification.service";

type ProjectMembersAddedNotification = {
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  projectId: Types.ObjectId;
  addedUserIds: Types.ObjectId[];
};

export const handleProjectMembersAddedNotification = async ({
  workspaceId,
  actorId,
  projectId,
  addedUserIds,
}: ProjectMembersAddedNotification) => {
  const recipientIds = addedUserIds.filter((id) => !id.equals(actorId));

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

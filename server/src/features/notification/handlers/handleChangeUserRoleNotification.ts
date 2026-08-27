import type { UserRole } from "@shared/types/user";
import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";
import { publishRealtimeNotification } from "./publishRealtimeNotification";

type ChangeUserRoleInput = {
  workspaceId: string;
  actorId: string;
  recipientId: string;
  previousRole: UserRole;
  currentRole: UserRole;
};

export const handleChangeUserRoleNotification = async ({
  workspaceId,
  actorId,
  recipientId,
  previousRole,
  currentRole,
}: ChangeUserRoleInput) => {
  if (actorId === recipientId) return;

  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const recipientObjectId = new Types.ObjectId(recipientId);

  await createNotification({
    workspaceId: workspaceObjectId,
    actorId: actorObjectId,
    recipientId: recipientObjectId,
    type: "role_changed",
    entityType: "user",
    entityId: recipientObjectId,
    metadata: {
      previousRole,
      currentRole,
    },
  });

  await publishRealtimeNotification([recipientId]);
};

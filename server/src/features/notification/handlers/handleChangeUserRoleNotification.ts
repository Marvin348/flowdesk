import type { UserRole } from "@shared/types/user";
import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type ChangeUserRoleInput = {
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  recipientId: Types.ObjectId;
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
  if (actorId.equals(recipientId)) return;

  await createNotification({
    workspaceId,
    actorId,
    recipientId,
    type: "role_changed",
    entityType: "user",
    entityId: recipientId,
    metadata: {
      previousRole,
      currentRole,
    },
  });
};

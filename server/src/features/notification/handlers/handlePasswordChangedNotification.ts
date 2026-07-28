import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandlePasswordChangedInput = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
};

export const handlePasswordChangedNotification = async ({
  workspaceId,
  recipientId,
}: HandlePasswordChangedInput) => {
  await createNotification({
    workspaceId,
    recipientId,
    type: "password_changed",
    entityType: "user",
    entityId: recipientId,
  });
};

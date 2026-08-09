import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandlePasswordChangedInput = {
  workspaceId: string;
  recipientId: string;
};

export const handlePasswordChangedNotification = async ({
  workspaceId,
  recipientId,
}: HandlePasswordChangedInput) => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const recipientObjectId = new Types.ObjectId(recipientId);

  await createNotification({
    workspaceId: workspaceObjectId,
    recipientId: recipientObjectId,
    type: "password_changed",
    entityType: "user",
    entityId: recipientObjectId,
  });
};

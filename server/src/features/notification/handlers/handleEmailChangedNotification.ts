import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleEmailChangedInput = {
  workspaceId: string;
  recipientId: string;
};
export const handleEmailChangedNotification = async ({
  workspaceId,
  recipientId,
}: HandleEmailChangedInput) => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const recipientObjectId = new Types.ObjectId(recipientId);

  await createNotification({
    workspaceId: workspaceObjectId,
    recipientId: recipientObjectId,
    type: "email_changed",
    entityType: "user",
    entityId: recipientObjectId,
  });
};

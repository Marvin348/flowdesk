import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleEmailChangedInput = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
};
export const handleEmailChangedNotification = async ({
  workspaceId,
  recipientId,
}: HandleEmailChangedInput) => {
  await createNotification({
    workspaceId,
    recipientId,
    type: "email_changed",
    entityType: "user",
    entityId: recipientId,
  });
};

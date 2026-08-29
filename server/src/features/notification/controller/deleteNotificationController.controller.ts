import type { Request, Response } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { notificationIdParamsSchema, } from "@/features/notification/validators/notification.validator";
import { AppError } from "@/utils/AppError";
import { deleteNotification } from "@/features/notification/services/deleteNotification.service";

export const deleteNotificationController = async (
  req: Request,
  res: Response,
) => {
  const notificationId = notificationIdParamsSchema.safeParse(req.params);

  if (!notificationId.success) {
    throw new AppError("Invalid notificationId", 400);
  }

  const { userId, workspaceId } = getAuthContext(req);

  await deleteNotification({
    userId,
    workspaceId,
    notificationId: notificationId.data.notificationId,
  });

  return res.status(200).json({ message: "Notification deleted successfully" });
};

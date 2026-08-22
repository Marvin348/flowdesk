import type { Request, Response } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { getUnreadNotificationCount } from "@/features/notification/services/getUnreadNotificationCount.service";

export const unreadCountNotificationController = async (
  req: Request,
  res: Response,
) => {
  const { workspaceId, userId } = getAuthContext(req);

  const unreadCount = await getUnreadNotificationCount({
    workspaceId,
    userId,
  });

  return res.status(200).json({ unreadCount });
};

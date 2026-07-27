import { asyncHandler } from "@/utils/asyncHandler";
import express from "express";
import {
  NotificationQuerySchema,
  NotificationReadParamsSchema,
} from "@/features/notification/validators/notification.validator";
import { AppError } from "@/utils/AppError";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { getNotifications } from "@/features/notification/services/getNotifications.service";
import { markNotificationAsRead } from "@/features/notification/services/markNotificationAsRead.service";
import { markAllNotificationsAsRead } from "@/features/notification/services/markAllNotificationsAsRead.service";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = NotificationQuerySchema.safeParse(req.query);

    if (!query.success) {
      throw new AppError("Invalid query", 400);
    }

    const { workspaceId, userId } = getAuthContext(req);

    const paginatedNotifications = await getNotifications({
      workspaceId,
      userId,
      query: query.data,
    });

    return res.status(200).json({ data: paginatedNotifications });
  }),
);

router.patch(
  "/:notificationId/read",
  asyncHandler(async (req, res) => {
    const params = NotificationReadParamsSchema.safeParse(req.params);

    if (!params.success) {
      throw new AppError("Invalid notificationId", 400);
    }

    const { workspaceId, userId } = getAuthContext(req);

    await markNotificationAsRead({
      workspaceId,
      userId,
      notificationId: params.data.notificationId,
    });

    return res.status(200).json({ message: "Notification marked as read" });
  }),
);

router.patch(
  "/read-all",
  asyncHandler(async (req, res) => {
    const { workspaceId, userId } = getAuthContext(req);

    await markAllNotificationsAsRead({ workspaceId, userId });

    return res
      .status(200)
      .json({ message: "Notifications all marked as read" });
  }),
);

export default router;

import { asyncHandler } from "@/utils/asyncHandler";
import express from "express";
import { NotificationQuerySchema } from "@/features/notification/validators/notification.validator";
import { AppError } from "@/utils/AppError";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { getNotifications } from "@/features/notification/services/getNotifications.service";

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

export default router;

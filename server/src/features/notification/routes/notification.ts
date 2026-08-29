import { asyncHandler } from "@/utils/asyncHandler";
import express from "express";
import { pinNotificationController } from "@/features/notification/controller/pinNotificationController.controller";
import { archiveNotificationController } from "@/features/notification/controller/archiveNotificationController.controller";
import { notificationController } from "@/features/notification/controller/notificationController.controller";
import { unreadCountNotificationController } from "@/features/notification/controller/unreadCountNotificationController.controller";
import { readAllNotificationController } from "@/features/notification/controller/readAllNotificationController.controller";
import { markNotificationAsReadController } from "@/features/notification/controller/markNotificationAsReadController.controller";
import { deleteNotificationController } from "@/features/notification/controller/deleteNotificationController.controller";

const router = express.Router();

router.get("/", asyncHandler(notificationController));

router.get("/unread-count", asyncHandler(unreadCountNotificationController));

router.patch("/read-all", asyncHandler(readAllNotificationController));

router.delete("/:notificationId", asyncHandler(deleteNotificationController));

router.patch("/:notificationId/pin", asyncHandler(pinNotificationController));

router.patch(
  "/:notificationId/archive",
  asyncHandler(archiveNotificationController),
);

router.patch(
  "/:notificationId/read",
  asyncHandler(markNotificationAsReadController),
);

export default router;

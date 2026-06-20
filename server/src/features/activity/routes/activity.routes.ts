import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import { getWorkspaceActivities } from "@/features/activity/services/getWorkspaceActivities.service.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const activities = await getWorkspaceActivities(workspaceId);

    return res.status(200).json({ activities });
  }),
);

export default router;

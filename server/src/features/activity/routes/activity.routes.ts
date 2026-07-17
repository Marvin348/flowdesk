import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { asyncHandler } from "@/utils/asyncHandler";
import express from "express";
import { getWorkspaceActivities } from "@/features/activity/services/getWorkspaceActivities.service";

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

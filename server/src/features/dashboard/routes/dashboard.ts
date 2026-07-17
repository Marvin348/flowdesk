import express from "express";
import { getDashboardOverview } from "@/features/dashboard/services/dashboard.service";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { asyncHandler } from "@/utils/asyncHandler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const dashborad = await getDashboardOverview(workspaceId);

    res.status(200).json({ data: dashborad });
  }),
);

export default router;

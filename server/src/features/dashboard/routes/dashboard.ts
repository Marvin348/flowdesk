import express from "express";
import { getDashboardOverview } from "@/features/dashboard/services/dashboard.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId, workspaceId } = getAuthContext(req);

  const dashborad = await getDashboardOverview({ userId, workspaceId });

  res.status(200).json({ data: dashborad });
});

export default router;

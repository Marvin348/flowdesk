import express from "express";
import { getDashboardOverview } from "@/features/dashboard/services/dashboard.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const dashborad = await getDashboardOverview(userId);

  res.status(200).json({ data: dashborad });
});

export default router;

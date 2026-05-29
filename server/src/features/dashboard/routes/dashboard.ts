import express from "express";
import { getDashboardOverview } from "../services/dashboard.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const dashborad = await getDashboardOverview();

  res.status(200).json({ data: dashborad });
});

export default router;

import express from "express";
import { readDb } from "@/utils/readDb.js";
import { getUsersPerformance } from "@/utils/user/getUsersPerformance.js";
import { pagination } from "@/utils/pagination.js";
import type { Request, Response } from "express";
import { getFilteredUsers } from "@/utils/user/getFilteredUsers.js";
import { getUserDetails } from "@/utils/user/getUserDetails.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.users });
});

type TeamMembersQuery = {
  search?: string;
  page?: string;
  limit?: string;
};

router.get("/team", (req: Request<{}, {}, {}, TeamMembersQuery>, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const db = readDb();

  const filteredUsers = getFilteredUsers(db.users, search);
  const userPerformance = getUsersPerformance(filteredUsers, db.tasks);

  let page = Number(req.query.page);
  let limit = Number(req.query.limit);

  if (isNaN(page)) page = 1;
  if (isNaN(limit)) limit = 6;

  const paginationItems = pagination(userPerformance, page, limit);

  return res.status(200).json({
    data: paginationItems,
  });
});

router.get("/:id/details", (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "userId invalid input" });
  }

  const db = readDb();

  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const userDetails = getUserDetails(user, db.projects, db.tasks);

  return res.status(200).json({ data: userDetails });
});

export default router;

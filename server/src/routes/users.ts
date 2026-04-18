import express from "express";
import { readDb } from "@/utils/readDb.js";
import { getUserPerformance } from "@/utils/user/getUserPerformance.js";
import { pagination } from "@/utils/pagination.js";
import type { Request, Response } from "express";

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

  const filteredUsers = db.users.filter((u) => {
    const searchQuery = search.toLowerCase();

    const matchesUserName = u.name.toLowerCase().includes(searchQuery);
    const matchesUserRole = u.role.toLowerCase().includes(searchQuery);
    const matchesUserJob = u.jobTitle?.toLowerCase().includes(searchQuery);

    return matchesUserName || matchesUserRole || matchesUserJob;
  });

  const userPerformance = getUserPerformance(filteredUsers, db.tasks);

  let page = Number(req.query.page);
  let limit = Number(req.query.limit);

  if (isNaN(page)) page = 1;
  if (isNaN(limit)) limit = 6;

  const paginationItems = pagination(userPerformance, page, limit);

  return res.status(200).json({
    data: paginationItems,
  });
});

export default router;

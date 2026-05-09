import express from "express";
import { readDb } from "@/utils/readDb.js";
import { Request } from "express";
import { ProjectOptionDto } from "@shared/types/dto/projects/projectOptions.dto.js";

const router = express.Router();

router.get(
  "/options",
  (req: Request<{}, {}, {}, { search?: string; userId?: string }>, res) => {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const userId = req.query.userId;

    const db = readDb();

    const projectOption: ProjectOptionDto[] = db.projects.map((p) => {
      const invitedUserIdsSet = new Set<string>(p.invitedUserIds);

      const isInvited = p.invitedUserIds.some((ids) => ids === userId);

      const users = db.users
        .filter((u) => invitedUserIdsSet.has(u.id))
        .map((u) => {
          return {
            id: u.id,
            name: u.name,
            avatarKey: u.avatarKey,
          };
        });

      return {
        id: p.id,
        title: p.title,
        createdAt: p.createdAt,
        isInvited,
        users,
      };
    });

    const recent = projectOption
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);

    const recentIdSet = new Set(recent.map((p) => p.id));

    const filteredProjectOptions = projectOption
      .filter((p) => {
        if (recentIdSet.has(p.id)) return false;

        const matchesSearch =
          !search || p.title.toLowerCase().includes(search.toLowerCase());

        return matchesSearch;
      })
      .slice(0, 5);

    return res.status(200).json({
      data: {
        recent: recent,
        results: search === "" ? [] : filteredProjectOptions,
      },
    });
  },
);

export default router;

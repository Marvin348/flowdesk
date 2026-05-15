import express from "express";
import { Request } from "express";
import { ProjectOptionDto } from "@shared/types/dto/projects/projectOptions.dto.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";

const router = express.Router();

// refactor later
router.get(
  "/options",
  async (
    req: Request<{}, {}, {}, { search?: string; userId?: string }>,
    res,
  ) => {
    try {
      const search =
        typeof req.query.search === "string" ? req.query.search.trim() : "";
      const userId = req.query.userId;

      const projectDocs = await ProjectModel.find().lean();
      const userDocs = await UserModel.find().lean();

      const projects = projectDocs.map(toProjectDto);
      const usersList = userDocs.map(toUserDto);

      const projectOption: ProjectOptionDto[] = projects.map((p) => {
        const invitedUserIdsSet = new Set<string>(p.invitedUserIds);

        const isInvited = p.invitedUserIds.some((ids) => ids === userId);

        const users = usersList
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
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch project options" });
    }
  },
);

export default router;

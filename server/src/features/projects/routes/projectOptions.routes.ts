import express from "express";
import { Request } from "express";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { toProjectOptionDto } from "@/features/projects/mappers/project-option.mapper.js";
import { getProjects } from "@/features/projects/services/project.service.js";

const router = express.Router();

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
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!userId) {
        return res.status(400).json({ error: "Invalid userId" });
      }

      const visibleProjects = await getProjects(currentUserId);
      const sortedProjects = [...visibleProjects].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const recentProjects = sortedProjects.slice(0, 3);

      const recentIdSet = new Set(recentProjects.map((project) => project.id));

      const searchProjectRecords =
        search === ""
          ? []
          : visibleProjects
              .filter(
                (project) =>
                  !recentIdSet.has(project.id) &&
                  project.title.toLowerCase().includes(search.toLowerCase()),
              )
              .slice(0, 5);

      const allUserIds = new Set<string>();

      for (const project of [...recentProjects, ...searchProjectRecords]) {
        for (const invitedUserId of project.invitedUserIds) {
          allUserIds.add(invitedUserId);
        }
      }

      const userRecords = await UserModel.find({
        _id: { $in: [...allUserIds] },
      }).lean();

      const usersList = userRecords.map(toUserDto);
      const usersById = new Map(usersList.map((user) => [user.id, user]));

      const recent = recentProjects.map((p) =>
        toProjectOptionDto(p, usersById, userId),
      );

      const results = searchProjectRecords.map((p) =>
        toProjectOptionDto(p, usersById, userId),
      );

      return res.status(200).json({
        data: {
          recent,
          results: search === "" ? [] : results,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch project options" });
    }
  },
);

export default router;

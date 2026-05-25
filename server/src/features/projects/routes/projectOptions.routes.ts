import express from "express";
import { Request } from "express";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { toProjectOptionDto } from "@/features/projects/mappers/project-option.mapper.js";

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

      if (!userId) {
        return res.status(400).json({ error: "Invalid userId" });
      }

      const recentProjectRecords = await ProjectModel.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      const recentProjects = recentProjectRecords.map(toProjectDto);

      const recentIdSet = new Set(recentProjects.map((project) => project.id));

      const searchQuery: Record<string, unknown> = {};

      if (search) {
        searchQuery.title = { $regex: search, $options: "i" };
        searchQuery._id = { $nin: [...recentIdSet] };
      }

      const searchProjectRecords =
        search === ""
          ? []
          : await ProjectModel.find(searchQuery).limit(5).lean();

      const searchProjects = searchProjectRecords.map(toProjectDto);

      const allUserIds = new Set<string>();

      for (const project of [...recentProjects, ...searchProjects]) {
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

      const results = searchProjects.map((p) =>
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

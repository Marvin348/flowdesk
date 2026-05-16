import express from "express";
import { getUsersPerformance } from "@/features/users/utils/getUsersPerformance.js";
import { pagination } from "@/shared/utils/pagination.js";
import type { Request, Response } from "express";
import { getFilteredUsers } from "@/features/users/utils/getFilteredUsers.js";
import { getUserDetails } from "@/features/users/utils/getUserDetails.js";
import { UserRole } from "@shared/types/user.js";
import type {
  TeamActivity,
  TeamProgress,
  TeamSort,
} from "@shared/types/teamFilter/teamFilter.js";
import { parseTeamFilter } from "@/shared/parsers/user-query-parsers.js";
import { getFilteredTeamMembers } from "@/features/users/utils/getFilteredTeamMembers.js";
import { sortTeamMembers } from "@/features/users/utils/sortTeamMembers.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UserModel.find().lean();
  res.json({ data: users });
});

export type TeamMembersQuery = {
  search?: string;
  page?: string;
  limit?: string;
  role?: UserRole;
  sort?: TeamSort;
  progress?: TeamProgress;
  activity?: TeamActivity;
};

router.get("/team", async (req: Request<{}, {}, {}, TeamMembersQuery>, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const parsedTeamFilter = parseTeamFilter(req.query);

    const userRecords = await UserModel.find().lean();
    const taskRecords = await TaskModel.find().lean();

    const users = userRecords.map(toUserDto);
    const tasks = taskRecords.map(toTaskDto);

    const filteredUsers = getFilteredUsers(
      users,
      search,
      parsedTeamFilter.role,
    );

    const teamMembers = getUsersPerformance(filteredUsers, tasks);

    const filteredTeamMembers = getFilteredTeamMembers(
      teamMembers,
      parsedTeamFilter,
    );

    const sortedTeamMembers = sortTeamMembers(
      filteredTeamMembers,
      parsedTeamFilter.sort,
    );

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 6;

    const paginationItems = pagination(sortedTeamMembers, page, limit);

    return res.status(200).json({
      data: paginationItems,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch team",
    });
  }
});

router.get("/:id/details", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "userId invalid input" });
    }

    const userRecord = await UserModel.findOne({ id: userId }).lean();

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const projectRecords = await ProjectModel.find().lean();
    const taskRecords = await TaskModel.find().lean();

    const user = toUserDto(userRecord);
    const projects = projectRecords.map(toProjectDto);
    const tasks = taskRecords.map(toTaskDto);

    const userDetails = getUserDetails(user, projects, tasks);

    return res.status(200).json({ data: userDetails });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch user details",
    });
  }
});

router.patch(
  "/:id",
  async (req: Request<{ id: string }, {}, { role: UserRole }>, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const isValidRole =
        role === "admin" || role === "member" || role === "manager";

      if (!isValidRole) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await UserModel.findOne({ id: userId }).lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === role) {
        return res.status(400).json({ error: "User already has this role" });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { id: userId },
        { role },
        { returnDocument: "after" },
      ).lean();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        data: toUserDto(updatedUser),
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update user role",
      });
    }
  },
);

export default router;

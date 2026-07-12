import express from "express";
import { Request } from "express";
import { UserModel } from "@/features/users/models/user.modal.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { removeProjectMember } from "@/features/projects/services/removeProjectMember.service.js";
import { removeProjectMemberParamsSchema } from "@/features/projects/validation/removeProjectMemberSchema.validator.js";
import mongoose from "mongoose";

const router = express.Router();

router.delete(
  "/:projectId/members/:userId",
  asyncHandler(
    async (req: Request<{ projectId: string; userId: string }>, res) => {
      const result = removeProjectMemberParamsSchema.safeParse(req.params);

      if (!result.success) {
        throw new AppError("Invalid params", 400);
      }

      const { projectId, userId } = result.data;

      const { role, workspaceId } = getAuthContext(req);

      await removeProjectMember({ workspaceId, projectId, userId, role });

      return res.status(200).json({ message: "User deleted successfully" });
    },
  ),
);

// update invitedUserIds
router.patch(
  "/:id/members",
  asyncHandler(
    async (
      req: Request<{ id: string }, {}, { userIdsToAdd: string[] }>,
      res,
    ) => {
      const projectId = req.params.id;
      const { userIdsToAdd } = req.body;

      const { role, workspaceId } = getAuthContext(req);

      if (!projectId) {
        throw new AppError("Invalid projectId", 400);
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid projectId", 400);
      }

      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      if (!Array.isArray(userIdsToAdd) || userIdsToAdd.length === 0) {
        throw new AppError("Invalid input", 400);
      }

      const project = await getProjectById({
        projectId: projectObjectId,
        workspaceId,
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      if (role !== "admin") {
        throw new AppError("Only admins can update invitedUsers", 403);
      }

      const uniqueUserIds = [...new Set(userIdsToAdd)];

      const matchingUsers = await UserModel.countDocuments({
        _id: { $in: uniqueUserIds },
        workspaceId,
      });

      if (matchingUsers !== uniqueUserIds.length) {
        throw new AppError("One or more users are invalid", 400);
      }

      const updatedProject = await ProjectModel.findOneAndUpdate(
        { _id: projectObjectId, workspaceId },
        {
          $addToSet: {
            invitedUserIds: {
              $each: userIdsToAdd,
            },
          },
        },
        { returnDocument: "after" },
      ).lean();

      if (!updatedProject) {
        throw new AppError("Project not found", 404);
      }

      return res.status(200).json({
        data: toProjectDto(updatedProject),
      });
    },
  ),
);

export default router;

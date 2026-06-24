import express from "express";
import { Request } from "express";
import { UserModel } from "@/features/users/models/user.modal.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import {
  getProjectById,
  getProjects,
} from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";

const router = express.Router();

type AssignUserInput = {
  projectIdsToAdd: string[];
  userId: string;
};

router.patch(
  "/assign-user",
  asyncHandler(async (req: Request<{}, {}, AssignUserInput>, res) => {
    const { projectIdsToAdd, userId } = req.body;

    const { role, workspaceId } = getAuthContext(req);

    if (typeof userId !== "string") {
      throw new AppError("Invalid userId", 400);
    }

    if (!Array.isArray(projectIdsToAdd) || projectIdsToAdd.length === 0) {
      throw new AppError("Invalid input", 400);
    }

    const user = await UserModel.findOne({ _id: userId, workspaceId }).lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (role !== "admin") {
      throw new AppError("Only admins can assign new projects", 403);
    }

    const visibleProjects = await getProjects({
      workspaceId,
    });

    const projectIdsToAddSet = new Set(projectIdsToAdd);
    const matchingProjects = visibleProjects.filter((project) =>
      projectIdsToAddSet.has(project.id),
    );

    const matchingProjectIds = matchingProjects.map((project) => project.id);

    if (projectIdsToAddSet.size !== matchingProjects.length) {
      throw new AppError("One or more projects are missing", 400);
    }

    const alreadyAssignedProject = matchingProjects.find((p) =>
      p.invitedUserIds.includes(userId),
    );

    if (alreadyAssignedProject) {
      throw new AppError("User already in project", 409);
    }

    await ProjectModel.updateMany(
      {
        _id: { $in: matchingProjectIds },
        workspaceId,
      },
      {
        $addToSet: {
          invitedUserIds: userId,
        },
      },
    );

    const updatedProjectDocs = await ProjectModel.find({
      _id: { $in: matchingProjectIds },
      workspaceId,
    });

    const updatedProjects = updatedProjectDocs.map(toProjectDto);

    return res.status(200).json({
      data: updatedProjects,
    });
  }),
);

// delete user from project
router.delete(
  "/:id/members/:userId",
  asyncHandler(async (req: Request<{ id?: string; userId?: string }>, res) => {
    const projectId = req.params.id;
    const userId = req.params.userId;

    const { role, workspaceId } = getAuthContext(req);

    if (!projectId) {
      throw new AppError("Invalid projectId", 400);
    }

    if (!userId) {
      throw new AppError("Invalid userId", 400);
    }

    const project = await getProjectById({
      projectId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    if (role !== "admin") {
      throw new AppError("Only admins can delete user", 403);
    }

    if (!project.invitedUserIds.includes(userId)) {
      throw new AppError("User is not a project member", 400);
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId, workspaceId },
      {
        $pull: {
          invitedUserIds: userId,
        },
      },
      { returnDocument: "after" },
    ).lean();

    if (!updatedProject) {
      throw new AppError("Project not found", 404);
    }

    await TaskModel.updateMany(
      {
        workspaceId,
        projectId,
        collaboratorIds: userId,
      },
      {
        $pull: {
          collaboratorIds: userId,
        },
      },
    );

    const tasksWithoutCollaborators = await TaskModel.find({
      workspaceId,
      projectId,
      collaboratorIds: { $size: 0 },
    }).lean();

    const taskIdsToDelete = tasksWithoutCollaborators.map((task) =>
      task._id.toString(),
    );

    if (taskIdsToDelete.length > 0) {
      await AttachmentModel.deleteMany({
        workspaceId,
        projectId,
        taskId: { $in: taskIdsToDelete },
      });

      await CommentModel.deleteMany({
        workspaceId,
        taskId: { $in: taskIdsToDelete },
      });

      await TaskModel.deleteMany({
        workspaceId,
        projectId,
        _id: { $in: taskIdsToDelete },
      });
    }

    return res.status(200).json({ data: toProjectDto(updatedProject) });
  }),
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

      if (!Array.isArray(userIdsToAdd) || userIdsToAdd.length === 0) {
        throw new AppError("Invalid input", 400);
      }

      const project = await getProjectById({
        projectId,
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
        { _id: projectId, workspaceId },
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

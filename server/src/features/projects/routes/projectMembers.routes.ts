import express from "express";
import { Request } from "express";
import { UserModel } from "@/features/users/models/user.modal.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { AttachmentModel } from "@/features/attchments/models/attachment.model.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";

const router = express.Router();

type AssignUserInput = {
  projectIdsToAdd: string[];
  userId: string;
};

// add new userId to projects
router.patch(
  "/assign-user",
  async (req: Request<{}, {}, AssignUserInput>, res) => {
    try {
      const { projectIdsToAdd, userId } = req.body;

      if (!Array.isArray(projectIdsToAdd) || typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid input" });
      }

      const user = await UserModel.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const matchingProjects = await ProjectModel.find({
        id: { $in: projectIdsToAdd },
      });

      const projectIdsToAddSet = new Set(projectIdsToAdd);

      if (projectIdsToAddSet.size !== matchingProjects.length) {
        return res
          .status(400)
          .json({ error: "one or more projects are missing" });
      }

      const alreadyAssignedProject = matchingProjects.find((p) =>
        p.invitedUserIds.includes(userId),
      );

      if (alreadyAssignedProject) {
        return res.status(409).json({ error: "User already in project" });
      }

      await ProjectModel.updateMany(
        {
          id: { $in: projectIdsToAdd },
        },
        {
          $addToSet: {
            invitedUserIds: userId,
          },
        },
      );

      const updatedProjectDocs = await ProjectModel.find({
        id: { $in: projectIdsToAdd },
      });

      const updatedProjects = updatedProjectDocs.map(toProjectDto);

      return res.status(200).json({
        data: updatedProjects,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to assign user to projects",
      });
    }
  },
);

// delete user from project
router.delete(
  "/:id/members/:userId",
  async (req: Request<{ id: string; userId: string }>, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.params.userId;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      if (!userId) {
        return res.status(400).json({ error: "Invalid userId" });
      }

      const project = await ProjectModel.findOne({ id: projectId });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (!project.invitedUserIds.includes(userId)) {
        return res.status(400).json({ error: "User is not a project member" });
      }

      const updatedProject = await ProjectModel.findOneAndUpdate(
        { id: projectId },
        {
          $pull: {
            invitedUserIds: userId,
          },
        },
        { returnDocument: "after" },
      ).lean();

      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      await TaskModel.updateMany(
        {
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
        projectId,
        collaboratorIds: { $size: 0 },
      }).lean();

      const taskIdsToDelete = tasksWithoutCollaborators.map((task) => task.id);

      if (taskIdsToDelete.length > 0) {
        await AttachmentModel.deleteMany({
          taskId: { $in: taskIdsToDelete },
        });

        await CommentModel.deleteMany({
          taskId: { $in: taskIdsToDelete },
        });

        await TaskModel.deleteMany({
          id: { $in: taskIdsToDelete },
        });
      }

      return res.status(200).json({ data: toProjectDto(updatedProject) });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to remove user from project",
      });
    }
  },
);

// update invitedUserIds
router.patch(
  "/:id/members",
  async (req: Request<{ id: string }, {}, { userIdsToAdd: string[] }>, res) => {
    try {
      const projectId = req.params.id;
      const { userIdsToAdd } = req.body;

      if (!projectId || !Array.isArray(userIdsToAdd)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const updatedProject = await ProjectModel.findOneAndUpdate(
        { id: projectId },
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
        return res.status(404).json({ error: "project not found" });
      }

      return res.status(200).json({
        data: toProjectDto(updatedProject),
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update project members",
      });
    }
  },
);

export default router;

import express from "express";
import type { Request } from "express";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { createComment } from "@/features/comments/services/createComment.service.js";
import { createCommentBodySchema } from "@/features/comments/validation/comments.validator.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const projects = await getProjects({ workspaceId });
    const projectIds = projects.map((project) => project.id);

    const taskRecords = await TaskModel.find({
      workspaceId,
      projectId: { $in: projectIds },
    }).lean();

    const taskIds = taskRecords.map((task) => task._id.toString());

    const comments = await CommentModel.find({
      workspaceId,
      taskId: { $in: taskIds },
    }).lean();

    res.json({ data: comments });
  }),
);

router.post(
  "/",
  asyncHandler(async (req: Request<{}, {}, CreateCommentInput>, res) => {
    const body = createCommentBodySchema.safeParse(req.body);

    if (!body.success) {
      throw new AppError("Invalid request body", 400);
    }
    
    const { userId, workspaceId } = getAuthContext(req);

    const newComment = await createComment({
      workspaceId,
      userId,
      input: body.data,
    });

    return res.status(201).json({
      data: newComment,
    });
  }),
);

export default router;

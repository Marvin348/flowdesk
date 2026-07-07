import express from "express";
import { Request } from "express";
import type { ProjectAttachmentQuery } from "@/features/projects/types/querys/projectAttachmentsQuery.js";
import multer from "multer";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { createAttachments } from "@/features/attachments/services/createAttachments.service.js";
import { deleteAttachment } from "@/features/attachments/services/deleteAttachment.service.js";
import {
  attachmentsProjectIdSchema,
  attachmentsQuerySchema,
} from "@/features/attachments/validators/attachments.validator.js";
import { getProjectAttachmentOverview } from "@/features/attachments/services/getProjectAttachmentOverview.service.js";
import mongoose from "mongoose";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

type DeleteAttachmentParams = {
  id: string;
  fileId: string;
};

router.delete(
  "/:id/files/:fileId",
  asyncHandler(
    async (req: Request<DeleteAttachmentParams, {}, {}, {}>, res) => {
      const projectId = req.params.id;
      const attachmentId = req.params.fileId;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid projectId", 400);
      }

      if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
        throw new AppError("Invalid attachmentId", 400);
      }

      const { userId, workspaceId, role } = getAuthContext(req);

      if (role !== "admin") {
        throw new AppError("Only admins can delete attachments", 403);
      }

      const deletedAttachment = await deleteAttachment({
        projectId,
        userId,
        workspaceId,
        attachmentId,
      });

      return res.status(200).json({ data: deletedAttachment });
    },
  ),
);

router.get(
  "/:projectId/files",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectAttachmentQuery>,
      res,
    ) => {
      const parsedParams = attachmentsProjectIdSchema.safeParse(req.params);

      if (!parsedParams.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const { projectId } = parsedParams.data;

      const querys = attachmentsQuerySchema.safeParse(req.query);

      if (!querys.success) {
        throw new AppError("Invalid query", 400);
      }

      const { search, page, limit } = querys.data;
      const { workspaceId } = getAuthContext(req);

      const projectAttachments = await getProjectAttachmentOverview({
        workspaceId,
        projectId,
        search,
        page,
        limit,
      });

      return res.status(200).json({
        data: projectAttachments,
      });
    },
  ),
);

router.post(
  "/:id/files",
  upload.array("files"),
  asyncHandler(
    async (req: Request<{ id: string }, {}, { taskId: string }>, res) => {
      const projectId = req.params.id;
      const taskId = req.body.taskId?.trim() || null;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid projectId", 400);
      }

      if (!files || files.length === 0) {
        throw new AppError("No files uploaded", 400);
      }

      const { userId, workspaceId } = getAuthContext(req);

      const newAttachments = await createAttachments({
        projectId,
        userId,
        workspaceId,
        taskId,
        files,
      });

      return res.status(201).json({ data: newAttachments });
    },
  ),
);

export default router;
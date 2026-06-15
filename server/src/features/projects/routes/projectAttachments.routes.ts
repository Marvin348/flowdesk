import { parsePagination } from "@/shared/parsers/parsePagination.js";
import express from "express";
import { Request } from "express";
import type { ProjectAttachmentQuery } from "@/features/projects/types/querys/projectAttachmentsQuery.js";
import { PAGE_LIMITS } from "@shared/constants/pagination.js";
import { buildAttachmentQuery } from "@/features/attachments/queries/buildAttachmentQuery.js";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toProjectAttachmentsDto } from "@/features/projects/mappers/project-attachments.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { getProjectById } from "@/features/projects/services/project.service.js";
import multer from "multer";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import {
  deleteFileFromR2,
  uploadFileToR2,
} from "@/features/attachments/services/attachmentStorage.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

type DeleteAttachmentParams = {
  id?: string;
  fileId?: string;
};

router.delete(
  "/:id/files/:fileId",
  asyncHandler(async (req: Request<DeleteAttachmentParams, {}, {}, {}>, res) => {
    const projectId = req.params.id;
    const attachmentId = req.params.fileId;

    if (!projectId) {
      throw new AppError("Invalid projectId", 400);
    }

    if (!attachmentId) {
      throw new AppError("Invalid attachmentId", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId,
      userId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const attachmentRecord = await AttachmentModel.findOne({
      _id: attachmentId,
      workspaceId,
      projectId,
    }).lean();

    if (!attachmentRecord) {
      throw new AppError("Attachment not found", 404);
    }

    await deleteFileFromR2(attachmentRecord.storageKey);

    const deletedAttachment = await AttachmentModel.deleteOne({
      _id: attachmentId,
      workspaceId,
      projectId,
    });

    await ProjectModel.findOneAndUpdate(
      { _id: projectId, workspaceId },
      {
        $currentDate: { updatedAt: true },
      },
    );

    return res.status(200).json({ data: deletedAttachment });
  }),
);

router.get(
  "/:id/files",
  asyncHandler(
    async (req: Request<{ id?: string }, {}, {}, ProjectAttachmentQuery>, res) => {
      const projectId = req.params.id;

      if (!projectId) {
        throw new AppError("Invalid projectId", 400);
      }

      const { userId, workspaceId } = getAuthContext(req);

      const project = await getProjectById({
        projectId,
        userId,
        workspaceId,
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      const search =
        typeof req.query.search === "string" ? req.query.search.trim() : "";

      const { page, limit, skip } = parsePagination({
        page: req.query.page,
        limit: req.query.limit,
        defaultLimit: PAGE_LIMITS.attachments,
      });

      const attachmentQuery = buildAttachmentQuery({
        projectId,
        workspaceId,
        search,
      });

      const totalItems = await AttachmentModel.countDocuments(attachmentQuery);

      const attachmentRecords = await AttachmentModel.find(attachmentQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const attachments = attachmentRecords.map(toAttachmentDto);

      const userIds = [...new Set(attachments.map((a) => a.userId))];

      const taskIds = [
        ...new Set(
          attachments
            .map((a) => a.taskId)
            .filter((t): t is string => Boolean(t)),
        ),
      ];

      const userRecords = await UserModel.find({
        workspaceId,
        _id: { $in: userIds },
      }).lean();
      const taskRecords = await TaskModel.find({
        workspaceId,
        projectId,
        _id: { $in: taskIds },
      }).lean();

      const users = userRecords.map(toUserDto);
      const tasks = taskRecords.map(toTaskDto);

      const usersById = new Map(users.map((u) => [u.id, u]));
      const tasksById = new Map(tasks.map((t) => [t.id, t]));

      const missingUserId = attachments.find(
        (a) => !usersById.has(a.userId),
      )?.userId;

      if (missingUserId) {
        throw new AppError(`Missing user for attachment: ${missingUserId}`, 500);
      }

      const projectAttachments = toProjectAttachmentsDto(
        attachments,
        usersById,
        tasksById,
      );

      return res.status(200).json({
        data: {
          items: projectAttachments,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      });
    },
  ),
);

router.post(
  "/:id/files",
  upload.array("files"),
  asyncHandler(
    async (req: Request<{ id?: string }, {}, { taskId?: string }>, res) => {
      const projectId = req.params.id;
      const taskId = req.body.taskId ?? null;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!projectId) {
        throw new AppError("Invalid projectId", 400);
      }

      const { userId, workspaceId } = getAuthContext(req);

      const project = await getProjectById({
        projectId,
        userId,
        workspaceId,
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      if (taskId) {
        const task = await TaskModel.findOne({
          _id: taskId,
          workspaceId,
          projectId,
        }).lean();

        if (!task) {
          throw new AppError("Task not found", 404);
        }
      }

      if (!files || files.length === 0) {
        throw new AppError("No files uploaded", 400);
      }

      const attachmentsToCreate = [];

      for (const file of files) {
        const storageKey = await uploadFileToR2(file);

        attachmentsToCreate.push({
          workspaceId,
          projectId,
          taskId,
          userId,
          fileName: file.originalname,
          storageKey,
          mimeType: file.mimetype,
          fileSize: file.size,
        });
      }

      const createdAttachments =
        await AttachmentModel.insertMany(attachmentsToCreate);

      await ProjectModel.findOneAndUpdate(
        { _id: projectId, workspaceId },
        {
          $currentDate: { updatedAt: true },
        },
      );

      return res.status(201).json({ data: createdAttachments });
    },
  ),
);

export default router;

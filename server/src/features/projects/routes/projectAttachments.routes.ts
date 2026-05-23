import { parsePagination } from "@/shared/parsers/parsePagination.js";
import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { Request, Response } from "express";
import type { ProjectAttachmentQuery } from "@/features/projects/types/querys/projectAttachmentsQuery.js";
import { PAGE_LIMITS } from "@shared/constants/pagination.js";
import { buildAttachmentQuery } from "@/features/attchments/queries/buildAttachmentQuery.js";
import { AttachmentModel } from "@/features/attchments/models/attachment.model.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toAttachmentDto } from "@/features/attchments/mappers/attachment.mapper.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toProjectAttachmentsDto } from "@/features/projects/mappers/project-attachments.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

type DeleteAttachmentParams = {
  id: string;
  fileId: string;
};

router.delete(
  "/:id/files/:fileId",
  async (req: Request<DeleteAttachmentParams, {}, {}, {}>, res) => {
    try {
      const projectId = req.params.id;
      const attachmentId = req.params.fileId;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      if (!attachmentId) {
        return res.status(400).json({ error: "Invalid attachmentId" });
      }

      const projectRecord = await ProjectModel.findOne({
        id: projectId,
      }).lean();

      if (!projectRecord) {
        return res.status(404).json({ error: "project not found" });
      }

      const attachmentRecord = await AttachmentModel.findOne({
        id: attachmentId,
        projectId,
      }).lean();

      if (!attachmentRecord) {
        return res.status(404).json({ error: "atachment not found" });
      }

      const relativeFilePath = attachmentRecord.fileUrl.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), relativeFilePath);

      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error("Failed to delete file from uploads folder", error);
      }

      const deletedAttachment = await AttachmentModel.deleteOne({
        id: attachmentId,
        projectId,
      });

      await ProjectModel.updateOne(
        { id: projectId },
        { $currentDate: { updatedAt: true } },
      );

      return res.status(200).json({ data: deletedAttachment });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to delete attachments",
      });
    }
  },
);

router.get(
  "/:id/files",
  async (req: Request<{ id: string }, {}, {}, ProjectAttachmentQuery>, res) => {
    try {
      const projectId = req.params.id;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
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

      const userRecords = await UserModel.find({ id: { $in: userIds } }).lean();
      const taskRecords = await TaskModel.find({ id: { $in: taskIds } }).lean();

      const users = userRecords.map(toUserDto);
      const tasks = taskRecords.map(toTaskDto);

      const usersById = new Map(users.map((u) => [u.id, u]));
      const tasksById = new Map(tasks.map((t) => [t.id, t]));

      const missingUserId = attachments.find(
        (a) => !usersById.has(a.userId),
      )?.userId;

      if (missingUserId) {
        return res.status(500).json({
          error: `Missing user for attachment: ${missingUserId}`,
        });
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
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch project files",
      });
    }
  },
);

router.post(
  "/:id/files",
  upload.array("files"),
  async (
    req: Request<{ id: string }, {}, { taskId?: string }>,
    res: Response,
  ) => {
    try {
      const projectId = req.params.id;
      const taskId = req.body.taskId ?? null;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!projectId) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      const projectRecord = await ProjectModel.findOne({
        id: projectId,
      }).lean();

      if (!projectRecord) {
        return res.status(404).json({ error: "project not found" });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const attachmentsToCreate = files.map((f) => ({
        id: crypto.randomUUID(),
        projectId,
        taskId,
        userId: "u3", // only test

        fileName: f.originalname,
        fileUrl: `/uploads/${f.filename}`,
        mimeType: f.mimetype,
        fileSize: f.size,
      }));

      const createdAttachments =
        await AttachmentModel.insertMany(attachmentsToCreate);

      await ProjectModel.updateOne(
        { id: projectId },
        { $currentDate: { updatedAt: true } },
      );

      return res.status(201).json({ data: createdAttachments });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to add new attachments",
      });
    }
  },
);

export default router;

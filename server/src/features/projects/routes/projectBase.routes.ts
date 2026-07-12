import express from "express";
import { Request } from "express";
import type { ProjectSummaryQuery } from "@/features/projects/types/querys/projectSummaryQuery.js";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput.js";
import {
  getProjectById,
  getProjects,
} from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { createProjectSchema } from "@/features/projects/validation/project.validator.js";
import { createProject } from "@/features/projects/services/createProject.service.js";
import { deleteProject } from "@/features/projects/services/deleteProject.service.js";
import { projectSummaryQuerySchema } from "@/features/projects/validation/projectSummary.validator.js";
import { getProjectSummary } from "@/features/projects/services/getProjectSummary.service.js";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/summaries",
  asyncHandler(async (req: Request<{}, {}, {}, ProjectSummaryQuery>, res) => {
    const query = projectSummaryQuerySchema.safeParse(req.query);

    if (!query.success) {
      throw new AppError("Invalid querys", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const projectSummary = await getProjectSummary({
      workspaceId,
      query: query.data,
    });

    return res.status(200).json({ data: projectSummary });
  }),
);

router.post(
  "/",
  asyncHandler(async (req: Request<{}, {}, CreateProjectInput>, res) => {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid input", 400);
    }

    const { userId, workspaceId, role } = getAuthContext(req);

    if (role !== "admin") {
      throw new AppError("Only admins can create projects", 403);
    }

    const newProject = await createProject({
      input: result.data,
      workspaceId,
      userId,
    });

    return res.status(201).json({ data: newProject });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res) => {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid projectId", 400);
    }

    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const { workspaceId } = getAuthContext(req);

    const project = await getProjectById({
      projectId: projectObjectId,
      workspaceId,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return res.status(200).json({ data: project });
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res) => {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid projectId", 400);
    }

    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const { userId, role, workspaceId } = getAuthContext(req);

    const deletedProject = await deleteProject({
      projectId: projectObjectId,
      userId,
      role,
      workspaceId,
    });

    return res.status(200).json({ data: deletedProject });
  }),
);

export default router;

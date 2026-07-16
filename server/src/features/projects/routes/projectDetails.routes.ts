import express from "express";
import type { ProjectCollaboratorsQuery } from "@/features/projects/types/querys/projectCollaboratorsQuery.js";
import { Request } from "express";
import type { ProjectCommentsQuery } from "@/features/projects/types/querys/projectCommentsQuery.js";
import { ProjectWorkloadQuery } from "@/features/projects/types/querys/projectWorkloadQuery.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { projectDetailsParamsSchema } from "@/features/projects/validation/project.validator.js";
import { getProjectDetails } from "@/features/projects/services/details/getProjectDetails.service.js";
import { getProjectOverview } from "@/features/projects/services/details/getProjectOverview.service.js";
import { getProjectTasks } from "@/features/projects/services/details/getProjectTasks.service.js";
import { projectCollaboratorQuerySchema } from "@/features/projects/validation/projectCollaboratorSchema.validator.js";
import { getProjectCollaborators } from "@/features/projects/services/collaborators/getProjectCollaborators.service.js";
import { projectCommentsQuerySchema } from "@/features/projects/validation/projectCommentsSchema.validator.js";
import { getProjectComments } from "@/features/projects/services/comments/getProjectComments.service.js";
import { projectWorkloadQuerySchema } from "@/features/projects/validation/projectWorkloadSchema.validator.js";
import { getProjectWorkload } from "@/features/projects/services/workload/getProjectWorkload.service.js";

const router = express.Router();

router.get(
  "/:projectId/details",
  asyncHandler(async (req: Request<{ projectId: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const projectDetails = await getProjectDetails({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({
      data: projectDetails,
    });
  }),
);

router.get(
  "/:projectId/overview",
  asyncHandler(async (req: Request<{ projectId: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const overview = await getProjectOverview({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({
      data: overview,
    });
  }),
);

router.get(
  "/:projectId/tasks",
  asyncHandler(async (req: Request<{ projectId: string }>, res) => {
    const param = projectDetailsParamsSchema.safeParse(req.params);

    if (!param.success) {
      throw new AppError("Invalid projectId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const projectTasks = await getProjectTasks({
      workspaceId,
      projectId: param.data.projectId,
    });

    return res.status(200).json({ data: projectTasks });
  }),
);

router.get(
  "/:projectId/collaborators",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectCollaboratorsQuery>,
      res,
    ) => {
      const param = projectDetailsParamsSchema.safeParse(req.params);

      if (!param.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const query = projectCollaboratorQuerySchema.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const projectCollaborators = await getProjectCollaborators({
        workspaceId,
        projectId: param.data.projectId,
        query: query.data,
      });

      return res.status(200).json({ data: projectCollaborators });
    },
  ),
);

router.get(
  "/:projectId/comments",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectCommentsQuery>,
      res,
    ) => {
      const param = projectDetailsParamsSchema.safeParse(req.params);

      if (!param.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const query = projectCommentsQuerySchema.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const projectComments = await getProjectComments({
        workspaceId,
        projectId: param.data.projectId,
        query: query.data,
      });

      return res.status(200).json({ data: projectComments });
    },
  ),
);

router.get(
  "/:projectId/workload",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, {}, ProjectWorkloadQuery>,
      res,
    ) => {
      const param = projectDetailsParamsSchema.safeParse(req.params);

      if (!param.success) {
        throw new AppError("Invalid projectId", 400);
      }

      const query = projectWorkloadQuerySchema.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const projectWorkload = await getProjectWorkload({
        workspaceId,
        projectId: param.data.projectId,
        query: query.data,
      });

      return res.status(200).json({ data: projectWorkload });
    },
  ),
);
export default router;

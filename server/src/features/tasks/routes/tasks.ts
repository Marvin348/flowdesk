import express from "express";
import type { Request } from "express";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { createTaskSchema } from "@/features/tasks/validators/task.validators.js";
import { createTask } from "@/features/tasks/services/createTask.service.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const projects = await getProjects({ workspaceId });
    const projectIds = projects.map((project) => project.id);

    const tasks = await TaskModel.find({
      workspaceId,
      projectId: { $in: projectIds },
    }).lean();

    return res.json({ data: tasks.map(toTaskDto) });
  }),
);

router.post(
  "/",
  asyncHandler(async (req: Request<{}, {}, CreateTaskInput>, res) => {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Missing required fields", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const newTask = await createTask({
      input: result.data,
      userId,
      workspaceId,
    });

    return res.status(201).json({
      data: newTask,
    });
  }),
);

export default router;

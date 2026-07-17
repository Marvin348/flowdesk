import express from "express";
import type { Request } from "express";
import type { CreateTaskInput } from "@shared/types/inputs/createTaskInput";
import { TaskModel } from "@/features/tasks/models/task.model";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { getProjects } from "@/features/projects/services/project.service";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import {
  createTaskSchema,
  taskStatusSchema,
} from "@/features/tasks/validators/task.validators";
import { createTask } from "@/features/tasks/services/createTask.service";
import { changeTaskStatus } from "../services/changeTaskStatus.service";
import type { TaskStatusFields } from "@/features/tasks/validators/task.validators";

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

  router.patch(
    "/:taskId/status",
    asyncHandler<{ taskId: string }>(
      async (req, res) => {
        const { taskId } = req.params;

        if (!taskId) {
          throw new AppError("Invalid taskId", 400);
        }

        const result = taskStatusSchema.safeParse(req.body);

        if (!result.success) {
          throw new AppError("Invalid body", 400);
        }

        const { workspaceId } = getAuthContext(req);

        const updatedTask = await changeTaskStatus({
          taskId,
          taskStatus: result.data.taskStatus,
          workspaceId,
        });

        res.status(200).json({ data: updatedTask });
      },
    ),
  ),
);

export default router;

import express from "express";
import { Request } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { userProjectOptionsQuery } from "@/features/users/validators/userProjectOptionsSchema.validator.js";
import { getUserProjectOptions } from "@/features/users/services/team/getUserProjectOptions.service.js";
import { assignProjectsToUserSchema } from "@/features/users/validators/assignProjectsToUserSchema.validator.js";
import { assignProjectsToUser } from "@/features/users/services/team/assignProjectsToUser.service.js";

const router = express.Router();

router.get(
  "/project-options",
  asyncHandler(
    async (
      req: Request<{}, {}, {}, { search: string; userId: string }>,
      res,
    ) => {
      const query = userProjectOptionsQuery.safeParse(req.query);

      if (!query.success) {
        throw new AppError("Invalid query params", 400);
      }

      const { workspaceId } = getAuthContext(req);

      const data = await getUserProjectOptions({
        workspaceId,
        query: query.data,
      });

      return res.status(200).json({
        data,
      });
    },
  ),
);

router.patch(
  "/project-assignments",
  asyncHandler(async (req, res) => {
    const result = assignProjectsToUserSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid body", 400);
    }

    const { workspaceId, role } = getAuthContext(req);

    const { userId, projectIdsToAdd } = result.data;

    await assignProjectsToUser({
      workspaceId,
      userId,
      projectIdsToAdd,
      role,
    });

    return res
      .status(200)
      .json({ message: "User assigned to projects successfully" });
  }),
);

export default router;

import express from "express";
import { Request } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { userProjectOptionsQuery } from "@/features/users/validators/userProjectOptionsSchema.validator.js";
import { getUserProjectOptions } from "@/features/users/services/team/getUserProjectOptions.service.js";

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

export default router;

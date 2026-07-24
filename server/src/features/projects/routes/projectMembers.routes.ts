import express from "express";
import { Request } from "express";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { removeProjectMember } from "@/features/projects/services/members/removeProjectMember.service";
import { removeProjectMemberParamsSchema } from "@/features/projects/validation/removeProjectMemberSchema.validator";
import {
  updateProjectMembersBodySchema,
  updateProjectMembersParamsSchema,
} from "@/features/projects/validation/updateProjectMemberSchema.validator";
import { addProjectMembers } from "@/features/projects/services/members/addProjectMembers.service";

const router = express.Router();

router.delete(
  "/:projectId/members/:userId",
  asyncHandler(
    async (req: Request<{ projectId: string; userId: string }>, res) => {
      const result = removeProjectMemberParamsSchema.safeParse(req.params);

      if (!result.success) {
        throw new AppError("Invalid params", 400);
      }

      const { projectId, userId } = result.data;

      const { role, workspaceId } = getAuthContext(req);

      await removeProjectMember({ workspaceId, projectId, userId, role });

      return res.status(200).json({ message: "User deleted successfully" });
    },
  ),
);

router.patch(
  "/:projectId/members",
  asyncHandler(
    async (
      req: Request<{ projectId: string }, {}, { userIdsToAdd: string[] }>,
      res,
    ) => {
      const params = updateProjectMembersParamsSchema.safeParse(req.params);

      if (!params.success) {
        throw new AppError("Invalid params", 400);
      }

      const body = updateProjectMembersBodySchema.safeParse(req.body);

      if (!body.success) {
        throw new AppError("Invalid body", 400);
      }

      const { role, workspaceId, userId } = getAuthContext(req);

      await addProjectMembers({
        workspaceId,
        role,
        userId,
        projectId: params.data.projectId,
        userIdsToAdd: body.data.userIdsToAdd,
      });

      return res.status(200).json({
        message: "Update invitedUserIds successfully",
      });
    },
  ),
);

export default router;

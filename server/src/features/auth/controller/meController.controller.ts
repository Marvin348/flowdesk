import type { Request, Response } from "express";
import { UserModel } from "@/features/users/models/user.modal";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { AppError } from "@/utils/AppError";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper";

export const meController = async (req: Request, res: Response) => {
  const { userId, workspaceId } = getAuthContext(req);

  const user = await UserModel.findOne({ _id: userId, workspaceId }).lean();

  if (!user) {
    throw new AppError("Not authenticated", 401);
  }

  return res.status(200).json({ user: toAuthUserDto(user) });
};

import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";
import { toUserSecurityOverviewDto } from "@/features/users/mappers/user.mapper";
import { Types } from "mongoose";

type GetMySecurityOverviewInput = {
  userId: string;
  workspaceId: Types.ObjectId;
};

export const getMySecurityOverview = async ({
  userId,
  workspaceId,
}: GetMySecurityOverviewInput) => {
  const user = await UserModel.findOne({ _id: userId, workspaceId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toUserSecurityOverviewDto(user);
};

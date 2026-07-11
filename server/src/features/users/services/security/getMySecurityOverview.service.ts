import { UserModel } from "@/features/users/models/user.modal.js";
import { AppError } from "@/utils/AppError.js";
import { toUserSecurityOverviewDto } from "@/features/users/mappers/user.mapper.js";

type GetMySecurityOverviewInput = {
  userId: string;
  workspaceId: string;
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

import mongoose from "mongoose";
import { UserModel } from "@/features/users/models/user.modal";
import { toUserDetailsDto } from "@/features/users/mappers/user-details.mapper";
import { AppError } from "@/utils/AppError";
import { buildUserDetailsPipeline } from "@/features/users/queries/userDetails.pipeline";
import type { UserDetailsAggregationResult } from "@/features/users/mappers/user-details.mapper";
import { Types } from "mongoose";

type GetUserDetailsInput = {
  workspaceId: Types.ObjectId;
  userId: string;
};

export const getUserDetails = async ({
  workspaceId,
  userId,
}: GetUserDetailsInput) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const pipeline = buildUserDetailsPipeline({
    workspaceId,
    userId: userObjectId,
  });

  const [details] =
    await UserModel.aggregate<UserDetailsAggregationResult>(pipeline);

  if (!details) {
    throw new AppError("User not found", 404);
  }

  return toUserDetailsDto(details);
};

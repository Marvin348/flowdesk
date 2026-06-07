import { UpdateCurrentUserInput } from "@/features/users/validators/user.validator.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";

type UpdateUserInput = {
  input: UpdateCurrentUserInput;
  userId: string;
  workspaceId: string;
};

export const updateCurrentUser = async ({
  input,
  userId,
  workspaceId,
}: UpdateUserInput) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      workspaceId,
    },
    {
      $set: input,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();

  if (!user) {
    throw new Error("User not found");
  }

  return toUserDto(user);
};

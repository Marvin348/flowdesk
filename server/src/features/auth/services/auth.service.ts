import { UserModel } from "@/features/users/models/user.modal.js";
import {
  comparePassword,
  hashPassword,
} from "@/features/auth/utils/password.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import {
  LoginInput,
  PasswordInput,
  RegisterInput,
} from "@/features/auth/validators/auth.validators.js";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { Types } from "mongoose";
import { AppError } from "@/utils/AppError.js";

export const registerUser = async (input: RegisterInput) => {
  const { email, name, password } = input;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const passwordHash = await hashPassword(password);

  const userId = new Types.ObjectId();
  const workspaceId = new Types.ObjectId();

  await WorkspaceModel.create({
    _id: workspaceId,
    ownerId: userId,
    name: `${name}s Workspace`,
  });

  const newUser = await UserModel.create({
    _id: userId,
    workspaceId,
    email,
    name,
    role: "admin",
    passwordHash,
  });

  const accessToken = createAccessToken(newUser._id.toString());

  return {
    user: toAuthUserDto(newUser),
    accessToken,
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = createAccessToken(user._id.toString());

  return {
    user: toAuthUserDto(user),
    accessToken,
  };
};

export const changePassword = async (input: PasswordInput, userId: string) => {
  const { currentPassword, newPassword } = input;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("Invalid user", 401);
  }

  const isPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid password", 400);
  }

  const isSameAsOldPassword = await comparePassword(
    newPassword,
    user.passwordHash,
  );

  if (isSameAsOldPassword) {
    throw new AppError(
      "New password must be different from current password",
      401,
    );
  }

  const hashedNewPassword = await hashPassword(newPassword);

  user.passwordHash = hashedNewPassword;

  await user.save();

  return { success: true };
};

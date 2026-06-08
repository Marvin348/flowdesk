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
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import { Types } from "mongoose";

export const registerUser = async (input: RegisterInput) => {
  const { email, name, password } = input;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
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
    user: toUserDto(newUser),
    accessToken,
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = createAccessToken(user._id.toString());

  return {
    user: toUserDto(user),
    accessToken,
  };
};

export const changePassword = async (input: PasswordInput, userId: string) => {
  const { currentPassword, newPassword } = input;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("Invalid user");
  }

  const isPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const isSameAsOldPassword = await comparePassword(
    newPassword,
    user.passwordHash,
  );

  if (isSameAsOldPassword) {
    throw new Error("New password must be different from current password");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  user.passwordHash = hashedNewPassword;

  await user.save();

  return { success: true };
};

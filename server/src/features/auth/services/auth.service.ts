import { UserModel } from "@/features/users/models/user.modal";
import {
  comparePassword,
  hashPassword,
} from "@/features/auth/utils/password";
import { createAccessToken } from "@/features/auth/utils/tokens";
import {
  LoginInput,
  PasswordInput,
  RegisterInput,
} from "@/features/auth/validators/auth.validators";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { Types } from "mongoose";
import { AppError } from "@/utils/AppError";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service";

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
    isEmailVerified: false,
    role: "admin",
    passwordHash,
  });

  const emailVerificationToken = await createVerificationToken({
    userId,
    type: "email_verification",
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;

  await sendAccountVerificationEmail({
    to: newUser.email,
    verificationUrl,
  });
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

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email first.", 403);
  }

  const accessToken = createAccessToken(user._id.toString());

  return {
    user: toAuthUserDto(user),
    accessToken,
  };
};

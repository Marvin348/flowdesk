import { UserModel } from "@/features/users/models/user.modal.js";
import { comparePassword } from "@/features/auth/utils/password.js";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import {
  LoginInput,
  RegisterInput,
} from "@/features/auth/validators/auth.validators.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";

export const registerUser = async (input: RegisterInput) => {};

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

import { UserModel } from "@/features/users/models/user.modal";
import { comparePassword, hashPassword } from "@/features/auth/utils/password";
import { RegisterInput } from "@/features/auth/validators/auth.validators";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import mongoose, { Types } from "mongoose";
import { AppError } from "@/utils/AppError";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { createSession } from "@/features/sessions/services/createSession.service";
import type { AuthLoginInput } from "@/features/auth/types/loginInput";
import { emailQueue } from "@/queues/emailQueue";
import { createEmailDelivery } from "@/features/emailDelivery/services/createEmailDelivery";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";

export const registerUser = async (input: RegisterInput) => {
  const { email, name, password } = input;

  const registration = await mongoose.connection.transaction(
    async (session) => {
      const existingUser = await UserModel.findOne({ email }).session(session);

      if (existingUser) {
        throw new AppError("Email already exists", 409);
      }

      const passwordHash = await hashPassword(password);

      const userId = new Types.ObjectId();
      const workspaceId = new Types.ObjectId();

      const workspace = new WorkspaceModel({
        _id: workspaceId,
        ownerId: userId,
        name: `${name}s Workspace`,
      });

      await workspace.save({ session });

      const newUser = new UserModel({
        _id: userId,
        workspaceId,
        email,
        name,
        isEmailVerified: false,
        role: "admin",
        passwordHash,
      });

      await newUser.save({ session });

      const emailVerificationToken = await createVerificationToken({
        userId,
        type: "email_verification",
      });

      const delivery = await createEmailDelivery(
        {
          rawToken: emailVerificationToken,
          userId,
          email: newUser.email,
          type: "account-verification",
        },
        session,
      );

      return {
        newUser,
        delivery,
      };
    },
  );

  await emailQueue.add(
    "account-verification",
    {
      deliveryId: registration.delivery._id.toString(),
    },
    {
      jobId: `email-${registration.delivery._id.toString()}`,
    },
  );

  await EmailDeliveryModel.findByIdAndUpdate(registration.delivery._id, {
    queuedAt: new Date(),
  });
};

export const loginUser = async ({ input, sessionMetadata }: AuthLoginInput) => {
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

  const sessionId = await createSession({ userId: user._id, sessionMetadata });

  return {
    user: toAuthUserDto(user),
    sessionId,
  };
};

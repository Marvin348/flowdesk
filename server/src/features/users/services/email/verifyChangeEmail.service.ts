import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { AppError } from "@/utils/AppError";
import { hashToken } from "@/utils/hashToken";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose, { Types } from "mongoose";
import { eventBus } from "@/shared/events/eventBus";
import type { EmailChangedEvent } from "@/features/users/events/userEvents";

type VerifyChangeEmailInput = {
  workspaceId: Types.ObjectId;
  token: string;
  userId: string;
};

export const verifyChangeEmail = async ({
  workspaceId,
  token,
  userId,
}: VerifyChangeEmailInput) => {
  const hashedToken = hashToken(token);
  const now = new Date();

  await mongoose.connection.transaction(async (session) => {
    const verificationToken = await VerificationTokenModel.findOne({
      tokenHash: hashedToken,
      type: "email_change",
    }).session(session);

    if (!verificationToken) {
      throw new AppError("Token not found", 400);
    }

    if (verificationToken.usedAt) {
      throw new AppError("Token was already used", 409);
    }

    if (verificationToken.expiresAt <= now) {
      throw new AppError("Token has expired", 410);
    }

    if (!verificationToken.userId.equals(userId)) {
      throw new AppError("UserId is wrong", 403);
    }

    if (!verificationToken.newEmail) {
      throw new AppError("New email does not exist", 400);
    }

    const user = await UserModel.findOne({ _id: userId, workspaceId }).session(
      session,
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const existingEmail = await UserModel.findOne({
      email: verificationToken.newEmail,
      _id: { $ne: userId },
    }).session(session);

    if (existingEmail) {
      throw new AppError("Email already in use", 409);
    }

    const tokenResult = await VerificationTokenModel.updateOne(
      {
        _id: verificationToken._id,
        usedAt: null,
      },
      {
        $set: {
          usedAt: now,
        },
      },
      { session },
    );

    if (tokenResult.modifiedCount === 0) {
      throw new AppError("Token was already used", 409);
    }

    user.email = verificationToken.newEmail;

    await user.save({ session });
  });

  await eventBus.emit<EmailChangedEvent>("user.email_changed", {
    workspaceId,
    recipientId: new mongoose.Types.ObjectId(userId),
  });
};

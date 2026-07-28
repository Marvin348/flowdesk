import { UserModel } from "@/features/users/models/user.modal";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { eventBus } from "@/shared/events/eventBus";
import { AppError } from "@/utils/AppError";
import { hashToken } from "@/utils/hashToken";
import mongoose, { Types } from "mongoose";
import type { PasswordChangedEvent } from "@/features/auth/events/authEvents";

type VerifyPasswordChangeInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  token: string;
};

export const verifyPasswordChange = async ({
  userId,
  workspaceId,
  token,
}: VerifyPasswordChangeInput) => {
  const hashedToken = hashToken(token);
  const now = new Date();

  await mongoose.connection.transaction(async (session) => {
    const verificationToken = await VerificationTokenModel.findOne({
      tokenHash: hashedToken,
      type: "password_change",
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
      throw new AppError("Token does not belong to this user", 403);
    }

    if (!verificationToken.newPasswordHash) {
      throw new AppError("New password is missing", 400);
    }

    const user = await UserModel.findOne({ _id: userId, workspaceId }).session(
      session,
    );

    if (!user) {
      throw new AppError("User not found", 404);
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

    user.passwordHash = verificationToken.newPasswordHash;
    user.passwordChangedAt = now;

    await user.save({ session });
  });

  await eventBus.emit<PasswordChangedEvent>("user.password_changed", {
    workspaceId,
    recipientId: new mongoose.Types.ObjectId(userId),
  });
};

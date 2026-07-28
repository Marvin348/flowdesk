import { hashToken } from "@/utils/hashToken";
import { VerificationTokenModel } from "@/features/verification-tokens/models/verificationToken.model";
import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";

export const verifyEmail = async ({ token }: { token: string }) => {
  const hashedToken = hashToken(token);
  const now = new Date();

  await mongoose.connection.transaction(async (session) => {
    const verificationToken = await VerificationTokenModel.findOne({
      tokenHash: hashedToken,
      type: "email_verification",
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

    const user = await UserModel.findById(verificationToken.userId).session(
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

    user.isEmailVerified = true;
    user.emailVerifiedAt = now;

    await user.save({ session });
  });
};

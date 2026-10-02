import { AppError } from "@/utils/AppError";
import { UserModel } from "@/features/users/models/user.modal";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { Types } from "mongoose";
import { emailQueue } from "@/queues/emailQueue";
import { createEmailDelivery } from "@/features/emailDelivery/services/createEmailDelivery";

type ChangeEmailInput = {
  userId: string;
  workspaceId: Types.ObjectId;
  newEmail: string;
};

export const changeEmail = async ({
  userId,
  workspaceId,
  newEmail,
}: ChangeEmailInput) => {
  const user = await UserModel.findOne({ workspaceId, _id: userId });

  if (!user) {
    throw new AppError("Invalid User", 400);
  }

  if (user.email === process.env.DEMO_ACCOUNT_EMAIL) {
    throw new AppError("The demo account email cannot be changed.", 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Email needs to be verifyt", 401);
  }

  if (user.email === newEmail) {
    throw new AppError("Email is already same", 409);
  }

  const existingEmail = await UserModel.findOne({ email: newEmail });

  if (existingEmail) {
    throw new AppError("Email already in use", 409);
  }

  const verificationToken = await createVerificationToken({
    userId: user._id,
    type: "email_change",
    newEmail,
  });

  const delivery = await createEmailDelivery({
    rawToken: verificationToken,
    userId: user._id,
    email: newEmail,
    type: "email_change",
  });

  await emailQueue.add(
    "email_change",
    {
      deliveryId: delivery._id.toString(),
    },
    {
      jobId: `email-${delivery._id.toString()}`,
    },
  );

  await EmailDeliveryModel.findByIdAndUpdate(delivery._id, {
    queuedAt: new Date(),
  });
};

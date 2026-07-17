import { UserModel } from "@/features/users/models/user.modal";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service";

export const resendVerificationEmail = async ({ email }: { email: string }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return;
  }

  if (user.isEmailVerified) {
    return;
  }

  const emailVerificationToken = await createVerificationToken({
    userId: user._id,
    type: "email_verification",
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;

  await sendAccountVerificationEmail({
    to: user.email,
    verificationUrl,
  });
};

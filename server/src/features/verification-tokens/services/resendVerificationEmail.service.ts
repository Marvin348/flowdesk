import { UserModel } from "@/features/users/models/user.modal.js";
import { createEmailVerificationToken } from "@/features/verification-tokens/services/createEmailVerificationToken.service.js";
import { sendVerificationEmail } from "@/features/email/services/email.service.js";

export const resendVerificationEmail = async ({ email }: { email: string }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return;
  }

  if (user.isEmailVerified) {
    return;
  }

  const emailVerificationToken = await createEmailVerificationToken(user._id);

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;

  await sendVerificationEmail({
    to: user.email,
    verificationUrl,
  });
};

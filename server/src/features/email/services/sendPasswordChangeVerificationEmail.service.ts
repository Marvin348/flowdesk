import { sendEmail } from "@/providers/emailProvider";
import { passwordChangeVerificationTemplate } from "@/features/email/templates/passwordChangeVerificationEmail";

type SendPasswordChangeVerificationEmailInput = {
  to: string;
  verificationUrl: string;
};

export const sendPasswordChangeVerificationEmail = async ({
  to,
  verificationUrl,
}: SendPasswordChangeVerificationEmailInput) => {
  const html = passwordChangeVerificationTemplate({ verificationUrl });

  await sendEmail({
    to,
    subject: "Bestätige dein neues Passwort",
    html,
  });
};

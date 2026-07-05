import { sendEmail } from "@/providers/emailProvider.js";
import { accountVerificationEmailTemplate } from "@/features/email/templates/accountVerificationEmail.js";

type SendAccountVerificationEmailInput = {
  to: string;
  verificationUrl: string;
};

export const sendAccountVerificationEmail = async ({
  to,
  verificationUrl,
}: SendAccountVerificationEmailInput) => {
  const html = accountVerificationEmailTemplate({ verificationUrl });

  await sendEmail({
    to,
    subject: "Bestätige deine E-Mail-Adresse",
    html,
  });
};

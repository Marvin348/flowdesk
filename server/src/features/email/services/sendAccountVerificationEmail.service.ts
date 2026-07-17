import { sendEmail } from "@/providers/emailProvider";
import { accountVerificationEmailTemplate } from "@/features/email/templates/accountVerificationEmail";

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

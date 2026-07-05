import { sendEmail } from "@/providers/emailProvider.js";
import { emailChangeVerificationEmailTemplate } from "../templates/emailChangeVerificationEmail.js";

type SendEmailChangeVerificationEmailInput = {
  to: string;
  verificationUrl: string;
  newEmail: string;
};

export const sendEmailChangeVerificationEmail = async ({
  to,
  verificationUrl,
  newEmail,
}: SendEmailChangeVerificationEmailInput) => {
  const html = emailChangeVerificationEmailTemplate({
    verificationUrl,
    newEmail,
  });

  await sendEmail({
    to,
    subject: "Bestätige deine neue E-Mail-Adresse",
    html,
  });
};

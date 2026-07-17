import { sendEmail } from "@/providers/emailProvider";
import { emailChangeVerificationEmailTemplate } from "../templates/emailChangeVerificationEmail";

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

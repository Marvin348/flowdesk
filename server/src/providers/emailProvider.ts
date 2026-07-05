import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
};

export const sendEmail = async ({ to, subject, html }: SendEmailInput) => {
  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
};

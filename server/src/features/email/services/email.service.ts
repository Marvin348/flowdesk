import { Resend } from "resend";

type SendVerificationEmailInput = {
  to: string;
  verificationUrl: string;
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
};

export const sendVerificationEmail = async ({
  to,
  verificationUrl,
}: SendVerificationEmailInput) => {
  // Local Resend testing with onboarding@resend.dev only works when `to` is the Resend account email.
  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Bestätige deine E-Mail-Adresse",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
      <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
        FlowDesk
      </p>

      <h1 style="margin: 0 0 16px; font-size: 24px; line-height: 1.3; color: #0f172a;">
        Bestätige deine E-Mail-Adresse
      </h1>

      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
        Willkommen bei FlowDesk. Bitte bestätige deine E-Mail-Adresse, um deinen Account zu aktivieren.
      </p>

      <a
        href="${verificationUrl}"
        style="display: inline-block; background-color: #ff8421; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 18px; border-radius: 8px;"
      >
        E-Mail bestätigen
      </a>

      <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
        Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
      </p>

      <p style="margin: 8px 0 0; font-size: 12px; line-height: 1.6; color: #64748b; word-break: break-all;">
        ${verificationUrl}
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />

      <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94a3b8;">
        Wenn du dich nicht bei FlowDesk registriert hast, kannst du diese E-Mail ignorieren.
      </p>
    </div>
  </div>
        `,
  });
};

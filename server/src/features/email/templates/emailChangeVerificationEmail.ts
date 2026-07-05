type EmailChangeVerificationEmailInput = {
  verificationUrl: string;
  newEmail: string;
};

export const emailChangeVerificationEmailTemplate = ({
  verificationUrl,
  newEmail,
}: EmailChangeVerificationEmailInput) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
      <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
        FlowDesk
      </p>

      <h1 style="margin: 0 0 16px; font-size: 24px; line-height: 1.3; color: #0f172a;">
        Bestätige deine neue E-Mail-Adresse
      </h1>

      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
        Für deinen FlowDesk-Account wurde eine neue E-Mail-Adresse hinterlegt.
        Bitte bestätige diese Adresse, damit die Änderung abgeschlossen werden kann.
      </p>

      ${
        newEmail
          ? `
      <div style="margin: 0 0 24px; padding: 14px 16px; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;">
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #64748b;">
          Neue E-Mail-Adresse
        </p>
        <p style="margin: 4px 0 0; font-size: 15px; line-height: 1.6; color: #0f172a; font-weight: 600; word-break: break-all;">
          ${newEmail}
        </p>
      </div>
      `
          : ""
      }

      <a
        href="${verificationUrl}"
        style="display: inline-block; background-color: #ff8421; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 18px; border-radius: 8px;"
      >
        Neue E-Mail bestätigen
      </a>

      <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
        Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
      </p>

      <p style="margin: 8px 0 0; font-size: 12px; line-height: 1.6; color: #64748b; word-break: break-all;">
        ${verificationUrl}
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />

      <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94a3b8;">
        Wenn du diese Änderung nicht angefordert hast, ignoriere diese E-Mail bitte nicht.
        Prüfe deinen FlowDesk-Account und ändere vorsichtshalber dein Passwort.
      </p>
    </div>
  </div>`;
};

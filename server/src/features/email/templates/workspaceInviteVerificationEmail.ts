type WorkspaceInviteTemplateInput = {
  inviteUrl: string;
  workspaceName: string;
  invitedByName?: string;
};

export const workspaceInviteTemplate = ({
  inviteUrl,
  workspaceName,
  invitedByName,
}: WorkspaceInviteTemplateInput) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
      <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
        FlowDesk
      </p>

      <h1 style="margin: 0 0 16px; font-size: 24px; line-height: 1.3; color: #0f172a;">
        Du wurdest zu einem Workspace eingeladen
      </h1>

      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
        ${
          invitedByName
            ? `${invitedByName} hat dich eingeladen, dem Workspace`
            : `Du wurdest eingeladen, dem Workspace`
        }
        <strong style="color: #0f172a;">${workspaceName}</strong> auf FlowDesk beizutreten.
      </p>

      <a
        href="${inviteUrl}"
        style="display: inline-block; background-color: #ff8421; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 18px; border-radius: 8px;"
      >
        Einladung ansehen
      </a>

      <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
        Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
      </p>

      <p style="margin: 8px 0 0; font-size: 12px; line-height: 1.6; color: #64748b; word-break: break-all;">
        ${inviteUrl}
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />

      <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94a3b8;">
        Wenn du diese Einladung nicht erwartet hast, kannst du diese E-Mail ignorieren.
      </p>
    </div>
  </div>`;
};

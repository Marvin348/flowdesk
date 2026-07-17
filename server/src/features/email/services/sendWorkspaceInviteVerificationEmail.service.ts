import { sendEmail } from "@/providers/emailProvider";
import { workspaceInviteTemplate } from "../templates/workspaceInviteVerificationEmail";

type SendWorkspaceInviteVerificationEmailInput = {
  to: string;
  inviteUrl: string;
  workspaceName: string;
};

export const sendWorkspaceInviteVerificationEmail = async ({
  to,
  inviteUrl,
  workspaceName,
}: SendWorkspaceInviteVerificationEmailInput) => {
  const html = workspaceInviteTemplate({
    inviteUrl,
    workspaceName,
  });

  await sendEmail({
    to,
    subject: `Einladung zu ${workspaceName} auf FlowDesk`,
    html,
  });
};

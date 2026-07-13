import { CheckCircle2 } from "lucide-react";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import { formatInviteExpiry } from "@/shared/utils/formatInviteExpiry";

const InviteSentResult = ({
  invite,
}: {
  invite: CreatedWorkspaceInviteDto;
}) => {
  const { expiresAt, email } = invite;

  const expiryLabel = formatInviteExpiry(expiresAt);

  return (
    <div className="rounded-md border bg-muted/35 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chart-2/10">
          <CheckCircle2 className="size-5 text-chart-2" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mt-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Einladung versendet</h4>
            <p className="text-sm text-muted-foreground">{expiryLabel}</p>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Die Einladung wurde erfolgreich gesendet an
          </p>

          <div className="mt-3 rounded-md border bg-card px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteSentResult;

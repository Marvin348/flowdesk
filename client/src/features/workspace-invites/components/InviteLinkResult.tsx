import { CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import { formatInviteExpiry } from "@/shared/utils/formatInviteExpiry";
import { useState } from "react";

const InviteLinkResult = ({
  invite,
}: {
  invite: CreatedWorkspaceInviteDto;
}) => {
  const [copied, setCopied] = useState(false);

  const { expiresAt, inviteUrl } = invite;

  const handleCopyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const expiryLabel = formatInviteExpiry(expiresAt);

  return (
    <div className="rounded-md border bg-muted/35 p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-chart-2" />
            <h4 className="text-sm font-semibold">Einladungslink erstellt</h4>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{expiryLabel}</p>

          <div className="mt-4 flex w-full items-center gap-2">
            <div className="min-w-0 flex-1 rounded-md border bg-card px-3 py-2">
              <p className="truncate text-sm text-foreground">{inviteUrl}</p>
            </div>
            <Button
              type="button"
              variant="accentOutline"
              size="sm"
              className="shrink-0 w-31"
              onClick={handleCopyInviteLink}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Kopiert
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Link kopieren
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteLinkResult;

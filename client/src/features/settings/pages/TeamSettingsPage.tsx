import InviteLinkResult from "@/features/workspace-invites/components/InviteLinkResult";
import InviteMemberForm from "@/features/workspace-invites/components/InviteMemberForm";
import { useCreateWorkspaceInvite } from "@/features/workspace-invites/hooks/useCreateWorkspaceInvite";
import type { InviteMemberFields } from "@/features/workspace-invites/schemas/inviteMemberSchema";
import { useState } from "react";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";

const TeamSettingsPage = () => {
  const [createdInvite, setCreatedInvite] =
    useState<CreatedWorkspaceInviteDto | null>(null);

  const { mutateAsync, isPending, isError } = useCreateWorkspaceInvite();

  const handleInviteMember = async (data: InviteMemberFields) => {
    const invite = await mutateAsync(data);

    setCreatedInvite(invite);
  };

  return (
    <div>
      <div>
        <InviteMemberForm
          onInviteMember={handleInviteMember}
          isError={isError}
          isInviting={isPending}
        />
      </div>

      {createdInvite && (
        <div className="mt-6">
          <InviteLinkResult invite={createdInvite} />
        </div>
      )}
    </div>
  );
};
export default TeamSettingsPage;

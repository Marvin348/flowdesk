import InviteSentResult from "@/features/workspace-invites/components/InviteSentResult";
import InviteMemberForm from "@/features/workspace-invites/components/InviteMemberForm";
import { useCreateWorkspaceInvite } from "@/features/workspace-invites/hooks/useCreateWorkspaceInvite";
import type { InviteMemberFields } from "@/features/workspace-invites/schemas/inviteMemberSchema";
import { useState } from "react";
import type { CreatedWorkspaceInviteDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import { getApiErrorStatus } from "@/shared/api/getApiError";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { getInviteErrorMessage } from "@/features/workspace-invites/utils/getInviteErrorMessage";

const TeamSettingsPage = () => {
  const [createdInvite, setCreatedInvite] =
    useState<CreatedWorkspaceInviteDto | null>(null);

  const { mutateAsync, isPending, error } = useCreateWorkspaceInvite();

  const handleInviteMember = async (data: InviteMemberFields) => {
    const invite = await mutateAsync(data);

    setCreatedInvite(invite);
  };

  const statusCode = getApiErrorStatus(error);
  const errorMessage = getInviteErrorMessage(statusCode);

  return (
    <div>
      <div>
        <InviteMemberForm
          onInviteMember={handleInviteMember}
          isInviting={isPending}
        />
      </div>

      {errorMessage && (
        <div className="mt-2">
          <ErrorMessage message={errorMessage} />
        </div>
      )}

      {createdInvite && (
        <div className="mt-6">
          <InviteSentResult invite={createdInvite} />
        </div>
      )}
    </div>
  );
};
export default TeamSettingsPage;

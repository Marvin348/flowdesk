import AcceptInviteForm from "@/features/workspace-invites/components/AcceptInviteForm";
import { useWorkspaceInvitePreview } from "@/features/workspace-invites/hooks/useWorkspaceInvitePreview";
import InviteLoadingState from "@/features/workspace-invites/components/InviteLoadingState";
import InviteErrorState from "@/features/workspace-invites/components/InviteErrorState";

const InviteContent = ({ token }: { token: string }) => {
  const { data: invite, isLoading, error } = useWorkspaceInvitePreview(token);

  if (isLoading) return <InviteLoadingState />;
  if (error || !invite) return <InviteErrorState/>

  return <AcceptInviteForm invite={invite} token={token} />;
};
export default InviteContent;

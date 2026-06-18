import { useParams } from "react-router";
import InviteContent from "@/features/workspace-invites/components/InviteContent";

const InvitePage = () => {
  const { token } = useParams();

  if (!token) {
    return <div>Invite-Link ist ungültig.</div>;
  }

  return <InviteContent token={token} />;
};
export default InvitePage;

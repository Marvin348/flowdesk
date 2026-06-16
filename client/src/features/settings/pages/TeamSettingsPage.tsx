import InviteLinkResult from "@/features/workspace-invites/components/InviteLinkResult";
import InviteMemberForm from "@/features/workspace-invites/components/InviteMemberForm";

const TeamSettingsPage = () => {
  return (
    <div>
      <div>
        <InviteMemberForm />
      </div>

      <div>
        <InviteLinkResult/>
      </div>
    </div>
  );
};
export default TeamSettingsPage;

import type { SettingTabs } from "@/features/settings/constants/settingsTabs";
import ProfileSettingsForm from "@/features/settings/components/ProfileSettingsForm";
import SecuritySettingsForm from "@/features/settings/components/SecuritySettingsForm";
import AppearanceSettings from "@/features/settings/components/AppearanceSettings";
import InviteMemberForm from "@/features/workspace-invites/components/InviteMemberForm";

const SettingsContent = ({ activeTab }: { activeTab: SettingTabs }) => {
  switch (activeTab) {
    case "profile":
      return <ProfileSettingsForm />;

    case "security":
      return <SecuritySettingsForm />;

    case "appearance":
      return <AppearanceSettings />;

    case "team-management":
      return <InviteMemberForm />;
  }
};
export default SettingsContent;

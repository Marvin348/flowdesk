import { useSearchParams } from "react-router";
import SettingsTabs from "@/features/settings/components/SettingsTabs";
import SettingsContent from "@/features/settings/components/SettingsContent";
import type { SettingTabs } from "@/features/settings/constants/settingsTabs";
import { isSettingTab } from "@/features/settings/constants/settingsTabs";

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const settingTab = searchParams.get("tab");
  const activeSettingTab: SettingTabs = isSettingTab(settingTab)
    ? settingTab
    : "profile";

  const onNavigation = (tab: SettingTabs) => setSearchParams({ tab });

  return (
    <div>
      <h2 className="font-semibold text-2xl border-b pb-2">Einstellungen</h2>

      <div className="flex flex-col md:flex-row mt-8 gap-6">
        <div className="w-50">
          <SettingsTabs
            onNavigation={onNavigation}
            activeTab={activeSettingTab}
          />
        </div>
        <div className="flex-1 max-w-200">
          <SettingsContent activeTab={activeSettingTab} />
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

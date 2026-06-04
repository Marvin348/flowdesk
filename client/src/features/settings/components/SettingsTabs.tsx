import { SETTING_TABS } from "@/features/settings/constants/settingsTabs";
import { Button } from "@/shared/components/ui/button";
import type { SettingTabs } from "@/features/settings/constants/settingsTabs";

type SettingsTabsProps = {
  onNavigation: (tabs: SettingTabs) => void;
  activeTab: SettingTabs;
};

const SettingsTabs = ({ onNavigation, activeTab }: SettingsTabsProps) => {
  return (
    <section>
      <div>
        {SETTING_TABS.map((setting) => (
          <Button
            key={setting.value}
            variant="secondary"
            className="border-none bg-transparent block my-2 text-base text-muted-foreground  hover:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium"
            onClick={() => onNavigation(setting.value)}
            data-state={activeTab === setting.value ? "active" : "inactive"}
          >
            {setting.label}
          </Button>
        ))}
      </div>
    </section>
  );
};
export default SettingsTabs;

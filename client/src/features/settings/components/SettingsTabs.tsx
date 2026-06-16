import { SETTING_TABS } from "@/features/settings/constants/settingsTabs";
import { NavLink } from "react-router";

const SettingsTabs = () => {
  return (
    <div className="flex flex-col gap-6">
      {SETTING_TABS.map((setting) => (
        <NavLink
          key={setting.path}
          to={setting.path}
          className={({ isActive }) =>
            `text-base duration-200 ${isActive && "font-medium text-foreground"}`
          }
        >
          {setting.label}
        </NavLink>
      ))}
    </div>
  );
};
export default SettingsTabs;

import SettingsTabs from "@/features/settings/components/SettingsTabs";
import { Outlet } from "react-router";

const SettingsPage = () => {
  return (
    <div>
      <h2 className="font-semibold text-2xl border-b pb-2">Einstellungen</h2>

      <div className="flex flex-col md:flex-row mt-8 gap-6">
        <aside className="w-50">
          <SettingsTabs />
        </aside>

        <div className="flex-1 max-w-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

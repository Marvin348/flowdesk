import { Outlet } from "react-router";
import { useApplyTheme } from "@/shared/hooks/useApplyTheme";
import type { AuthUser } from "@shared/types/user";
import { useRealtimeNotifications } from "@/realtime/useRealtimeNotifications";

const ProtectedApp = ({ user }: { user: AuthUser }) => {
  useApplyTheme(user.settings.appearance.theme);
  useRealtimeNotifications();

  return <Outlet />;
};
export default ProtectedApp;

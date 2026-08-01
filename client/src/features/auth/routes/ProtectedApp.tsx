import { Outlet } from "react-router";
import { useApplyTheme } from "@/shared/hooks/useApplyTheme";
import type { AuthUser } from "@shared/types/user";

const ProtectedApp = ({ user }: { user: AuthUser }) => {
  useApplyTheme(user.settings.appearance.theme);

  return <Outlet />;
};
export default ProtectedApp;

import { SIDEBAR_MAIN_LINKS } from "@/shared/constants/sidebar-links";
import { NavLink } from "react-router";
import { Button } from "@/shared/components/ui/button";
import logo from "@/assets/logo.svg";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import SidebarUserMenu from "@/shared/components/layout/sidebar/SidebarUserMenu";
import NotificationSidebarBadge from "@/features/notification/components/NotificationSidebarBadge";

type SidebarProps = {
  onOpen: boolean;
  onClose: () => void;
};
const Sidebar = ({ onOpen, onClose }: SidebarProps) => {
  useScrollLock(onOpen);

  const sidebarLinkClass = (isActive: boolean) =>
    `flex items-center gap-2 rounded-md p-2 transition-colors ${
      isActive
        ? "bg-muted-foreground/5 text-foreground"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    }`;
  const sidebarIconClass = (isActive: boolean) =>
    `size-4 ${isActive ? "text-accent" : "text-muted-foreground"}`;

  return (
    <>
      <div
        className={`sidebar-overlay transform duration-300 ease-in-out ${onOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      <nav
        className={`fixed top-0 left-0 bottom-0 bg-surface border-r border-border p-4 transform duration-300 ease-in-out z-30 h-full w-65 ${onOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:static
        lg:min-h-screen
        lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end lg:hidden">
            <Button
              className="border-2 border-muted-foreground/20 rounded-full"
              size="icon-lg"
              onClick={onClose}
              variant="secondary"
            >
              X
            </Button>
          </div>

          <div className="hidden lg:inline-block mb-12">
            <img src={logo} alt="FlowDesk" />
          </div>

          <div className="mt-6 lg:mt-0">
            {SIDEBAR_MAIN_LINKS.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => sidebarLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={sidebarIconClass(isActive)} />

                    <p>{label}</p>

                    {to === "/notifications" && <NotificationSidebarBadge />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto">
            <SidebarUserMenu />
          </div>
        </div>
      </nav>
    </>
  );
};
export default Sidebar;

import { SIDEBAR_LINKS } from "@/constants/sidebar-links";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";
import { useScrollLock } from "@/hooks/useScrollLock";

type SidebarProps = {
  onOpen: boolean;
  onClose: () => void;
};
const Sidebar = ({ onOpen, onClose }: SidebarProps) => {
  useScrollLock(onOpen);

  return (
    <>
      <div
        className={`overlay transform duration-300 ease-in-out ${onOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      <nav
        className={`fixed top-0 bottom-0 bg-surface p-4 rounded-r-md transform duration-300 ease-in-out z-100 w-60 ${onOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:min-h-screen lg:translate-x-0`}
      >
        <div className="flex justify-end lg:hidden">
          <Button
            className="border border-accent rounded-full"
            size="icon-lg"
            onClick={onClose}
          >
            X
          </Button>
        </div>

        <div className="mb-12">
          <img src={logo} alt="FlowDesk" className="w-44" />
        </div>

        <div className="mt-10 lg:mt-0">
          {SIDEBAR_LINKS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 my-4 p-2 font-medium rounded-md ${isActive ? "bg-muted-foreground/10 text-accent" : "text-white"}`
              }
            >
              <Icon size={20} />
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};
export default Sidebar;

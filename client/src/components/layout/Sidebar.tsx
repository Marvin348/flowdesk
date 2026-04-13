import {
  SIDEBAR_MAIN_LINKS,
  SIDEBAR_FOOTER_LINKS,
} from "@/constants/sidebar-links";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.svg";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Star, LogOut } from "lucide-react";
import { useAppStore } from "@/store";
import { useProjects } from "@/queries/projects/useProjects";

type SidebarProps = {
  onOpen: boolean;
  onClose: () => void;
};
const Sidebar = ({ onOpen, onClose }: SidebarProps) => {
  useScrollLock(onOpen);

  const {data: projects = []} = useProjects();

  const badgeByProjectId = useAppStore((state) => state.badgeByProjectId);

  const projectWithBadge = projects.map((pro) => {
    return {
      ...pro,
      badge: badgeByProjectId[pro.id],
    };
  });

  const favorites = projectWithBadge.filter(
    (project) => project.badge === "favorite",
  );

  return (
    <>
      <div
        className={`overlay transform duration-300 ease-in-out ${onOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      <nav
        className={`fixed top-0 left-0 bottom-0 bg-surface p-4 transform duration-300 ease-in-out z-100 h-full w-65 ${onOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:min-h-screen lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end lg:hidden">
            <Button
              className="border-2 border-muted-foreground/20 rounded-full"
              size="icon-lg"
              onClick={onClose}
            >
              X
            </Button>
          </div>

          <div className="hidden lg:inline-block mb-12">
            <img src={logoWhite} alt="FlowDesk" className="w-44" />
          </div>

          <div className="mt-6 lg:mt-0">
            {SIDEBAR_MAIN_LINKS.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 my-4 p-2 rounded-md ${isActive ? "bg-muted-foreground/10 text-accent" : "text-white"}`
                }
              >
                <Icon className="size-5" />
                <p>{label}</p>
              </NavLink>
            ))}
          </div>

          <div className="mt-6">
            {favorites.length > 0 && (
              <div className="mt-12 ">
                <h4 className="mb-3 text-muted-foreground uppercase">
                  Favoriten
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {favorites.map((project) => (
                    <NavLink
                      key={project.id}
                      to={`/project/${project.id}`}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md text-white ${isActive ? "bg-muted-foreground/10" : ""}`
                      }
                      onClick={onClose}
                    >
                      <span className="shrink-0 flex items-center justify-center size-8 rounded-full bg-muted-foreground/20">
                        <Star className="size-5 text-accent" />
                      </span>

                      <span className="truncate">{project.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto">
            {SIDEBAR_FOOTER_LINKS.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `
              flex items-center gap-2 my-4 p-2 rounded-md ${isActive ? "bg-muted-foreground/10 text-accent" : "text-white"}`}
              >
                <Icon className="size-5" />
                <p>{label}</p>
              </NavLink>
            ))}
            <Button className="flex items-center gap-2 p-2 text-base">
              <LogOut className="size-5 rotate-180" /> Logout
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Sidebar;

import { SIDEBAR_LINKS } from "@/constants/sidebar-links";
import { NavLink, Link } from "react-router";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.svg";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Star } from "lucide-react";
import { useAppStore } from "@/store";
import { useCoreData } from "@/queries/useCoreData";

type SidebarProps = {
  onOpen: boolean;
  onClose: () => void;
};
const Sidebar = ({ onOpen, onClose }: SidebarProps) => {
  useScrollLock(onOpen);

  const { projects } = useCoreData();
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

  console.log("projectWithBadge", projectWithBadge);

  return (
    <>
      <div
        className={`overlay transform duration-300 ease-in-out ${onOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      <nav
        className={`fixed top-0 bottom-0 bg-surface p-4 rounded-r-md transform duration-300 ease-in-out z-100 w-65 ${onOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:min-h-screen lg:translate-x-0`}
      >
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

        {favorites.length > 0 && (
          <div className="mt-12 ">
            <h4 className="mb-3 text-muted-foreground uppercase">Favoriten</h4>
            <div className="grid grid-cols-1 gap-4">
              {favorites.map((project) => (
                <Link
                  key={project.id}
                  to="/projects"
                  className="flex items-center gap-2 text-white"
                  onClick={onClose}
                >
                  <span className="shrink-0 flex items-center justify-center size-8 rounded-full bg-muted-foreground/20">
                    <Star size={20} stroke="#FF8421" />
                  </span>

                  <span className="truncate">{project.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
export default Sidebar;

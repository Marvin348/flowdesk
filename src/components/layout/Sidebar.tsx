import { SIDEBAR_LINKS } from "@/constants/sidebar-links";
import { NavLink } from "react-router";
const Sidebar = () => {
  return (
    <>
      <div className=""></div>

      <nav className="bg-surface p-4 z-100">
        {SIDEBAR_LINKS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 my-4 p-2 rounded-xl ${isActive ? "bg-accent" : "text-white"}`
            }
          >
            <Icon />
            <p>{label}</p>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
export default Sidebar;

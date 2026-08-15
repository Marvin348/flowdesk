import { TAB_VIEW_OPTIONS } from "@/features/projects/constants/tab-view.options";
import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";

const ProjectTabs = () => {
  return (
    <div className="border-y py-2">
      <div className="flex items-center gap-4">
        {TAB_VIEW_OPTIONS.map(({ value, label, to, icon: Icon }) => (
          <NavLink
            key={value}
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex h-8 w-fit items-center gap-2 px-2 text-sm font-normal",
                "after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-[2px] after:content-['']",
                isActive
                  ? "text-foreground after:bg-accent"
                  : "text-foreground after:bg-transparent",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`size-4 ${isActive ? "text-accent" : undefined}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
export default ProjectTabs;

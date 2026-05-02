import { Button } from "@/components/ui/button";
import SearchInput from "../query-controls/SearchInput";
import { useAppStore } from "@/store";
import { FILTER_VIEW_OPTIONS } from "@/constants/filter/view-options";
import type { ProjectsSummary } from "@/hooks/useProjectsSummary";
import { Filter } from "lucide-react";

type ProjectToolbarProps = {
  onDrawerOpen: () => void;
  projectSummary: ProjectsSummary;
};

const ProjectToolbar = ({
  onDrawerOpen,
  projectSummary,
}: ProjectToolbarProps) => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);

  // refactor later
  const enrichedView = FILTER_VIEW_OPTIONS.map((view) => {
    const all = view.value === "all";

    const count = all
      ? projectSummary.total
      : projectSummary.byBadges[view.value];

    return {
      ...view,
      count,
    };
  });

  return (
    <div className="relative flex items-center justify-between border-y py-2">
      <div className="hidden md:flex">
        {enrichedView.map(({ label, value, icon: Icon, count }) => (
          <Button
            key={value}
            variant="filter"
            data-state={filter.view === value ? "active" : "inactive"}
            onClick={() => setFilter({ view: value })}
          >
            <Icon size={15} /> {label}
            <span
              className="text-sm font-bold data-[state=active]:text-accent"
              data-state={filter.view === value ? "active" : "inactive"}
            >
              {count}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="w-full xl:w-80">
          <SearchInput />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="relative text-foreground/90"
          onClick={onDrawerOpen}
        >
          <Filter /> Filter
        </Button>
      </div>
    </div>
  );
};
export default ProjectToolbar;

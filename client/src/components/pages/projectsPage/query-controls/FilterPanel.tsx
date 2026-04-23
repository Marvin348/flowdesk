import { FILTER_VIEW_OPTIONS } from "@/constants/filter/view-options";
import SearchInput from "@/components/pages/projectsPage/query-controls/SearchInput";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store";
import type { ProjectsSummary } from "@/hooks/useProjectsSummary";

type FilterPanelProps = {
  onOpen: () => void;
  projectSummary: ProjectsSummary;
};

const FilterPanel = ({ onOpen, projectSummary }: FilterPanelProps) => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);
  const hasActiveFilter = useAppStore((state) => state.hasActiveFilter());

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
          onClick={onOpen}
        >
          <Filter /> Filter
          {hasActiveFilter && (
            <span className="absolute left-1.5 bottom-1.5 size-2 rounded-full bg-accent"></span>
          )}
        </Button>
      </div>
    </div>
  );
};
export default FilterPanel;

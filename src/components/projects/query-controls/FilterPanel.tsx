import { FILTER_VIEW_OPTIONS } from "@/constants/filter/view-options";
import { STATUS_OPTIONS } from "@/constants/status-options";
import SearchInput from "@/components/projects/query-controls/SearchInput";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store";
import type { StatusBase } from "@/type/domain/StatusBase";
import type { ProjectsSummary } from "@/hooks/useProjectsSummary";

type FilterPanelProps = {
  onOpen: () => void;
  projectSummary: ProjectsSummary;
};

const FilterPanel = ({ onOpen, projectSummary }: FilterPanelProps) => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);

  const toggleStatusFilter = (value: StatusBase) => {
    const isActive = filter.status === value;

    setFilter({
      ...filter,
      status: isActive ? undefined : value,
    });
  };

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

  const enrichedStatus = Object.values(STATUS_OPTIONS).map((opt) => {
    return {
      ...opt,
      count: projectSummary.byStatus[opt.value],
    };
  });

  return (
    <div className="relative flex flex-col md:flex-row justify-between border-y py-2">
      <div className="flex items-center">
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
        <div className="hidden 2xl:flex">
          {enrichedStatus.map(({ label, value, icon: Icon, count }) => (
            <Button
              key={value}
              variant="filter"
              className=""
              data-state={filter.status === value ? "active" : "inactive"}
              onClick={() => toggleStatusFilter(value)}
            >
              <Icon size={15} /> {label}
              <span
                className="text-sm font-bold data-[state=active]:text-accent"
                data-state={filter.status === value ? "active" : "inactive"}
              >
                {count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-end gap-3">
        <SearchInput />
        <Button
          variant="outline"
          size="sm"
          className="text-foreground/90"
          onClick={onOpen}
        >
          <Filter /> Filter
        </Button>
      </div>
    </div>
  );
};
export default FilterPanel;

import { FILTER_VIEW_OPTIONS } from "@/constants/filter/view-options";
import { STATUS_OPTIONS } from "@/constants/status-options";
import SearchInput from "@/components/projects/query-controls/SearchInput";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAppStore } from "@/store";
import type { TaskStatus } from "@/type/taskStatus";
import { useScrollLock } from "@/hooks/useScrollLock";

type FilterPanelProps = {
  onOpen: () => void;
};

const FilterPanel = ({ onOpen }: FilterPanelProps) => {
  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);

  const toggleStatusFilter = (value: TaskStatus) => {
    const isActive = filter.status === value;

    setFilter({
      ...filter,
      status: isActive ? undefined : value,
    });
  };

  console.log(filter);

  return (
    <div className="relative flex flex-col lg:flex-row justify-between border-y py-2">
      <div className="hidden xl:flex">
        {FILTER_VIEW_OPTIONS.map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            variant="filter"
            className=""
            data-state={filter.view === value ? "active" : "inactive"}
            onClick={() => setFilter({ view: value })}
          >
            <Icon size={15} /> {label}
          </Button>
        ))}
        {Object.values(STATUS_OPTIONS).map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            variant="filter"
            className=""
            data-state={filter.status === value ? "active" : "inactive"}
            onClick={() => toggleStatusFilter(value)}
          >
            <Icon size={15} /> {label}
          </Button>
        ))}
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

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PRIORITY_OPTIONS } from "@/constants/priority-options";
import { STATUS_OPTIONS } from "@/constants/status-options";
import { useAppStore } from "@/store";
import { useRef } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { ContentFilter } from "@shared/types/filter/contentFilter";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type FilterDrawerProps = {
  onClose: () => void;
  isOpen: boolean;
};
const FilterDrawer = ({ onClose, isOpen }: FilterDrawerProps) => {
  useScrollLock(isOpen);

  const filter = useAppStore((state) => state.filter);
  const setFilter = useAppStore((state) => state.setFilter);
  const clearFilter = useAppStore((state) => state.clearFilter);

  const filterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(filterRef, () => onClose());

  const toggleFilter = <K extends keyof ContentFilter>(
    key: K,
    value: ContentFilter[K],
  ) => {
    const isActive = filter[key] === value;

    setFilter({ [key]: isActive ? undefined : value });
  };

  const onReset = () => {
    clearFilter();
    onClose();
  };

  return (
    <div
      className={
        "absolute top-5 right-0 w-100 border rounded-md bg-white shadow-xl z-100"
      }
      ref={filterRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-bold">Filter</h3>
        <button className="text-surface/80 hover:text-black" onClick={onClose}>
          <X className="size-5" />
        </button>
      </div>

      <div className="p-4">
        <div>
          <h4 className="font-medium">Priorität</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            {Object.values(PRIORITY_OPTIONS).map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => toggleFilter("priority", opt.value)}
                data-state={
                  filter.priority === opt.value ? "active" : "inactive"
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium">Status</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            {Object.values(STATUS_OPTIONS).map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => toggleFilter("status", opt.value)}
                data-state={filter.status === opt.value ? "active" : "inactive"}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium">Anhänge</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="filter_drawer"
              className="rounded-full"
              onClick={() => toggleFilter("hasAttachments", true)}
              data-state={filter.hasAttachments ? "active" : "inactive"}
            >
              Mit Anhängen
            </Button>
            <Button
              size="sm"
              variant="filter_drawer"
              className="rounded-full"
              onClick={() => toggleFilter("hasAttachments", false)}
              data-state={
                filter.hasAttachments === false ? "active" : "inactive"
              }
            >
              Ohne Anhänge
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 border-t">
        <button onClick={onReset} className="underline text-sm text-surface/90">
          Zurücksetzten
        </button>
      </div>
    </div>
  );
};
export default FilterDrawer;

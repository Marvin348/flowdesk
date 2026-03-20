import { Button } from "@/components/ui/button";
import { Search, RotateCcw, X } from "lucide-react";
import { PRIORITY_OPTIONS } from "@/constants/priority-options";
import { useAppStore } from "@/store";
import SelectedStatus from "@/components/ui/select/SelectedStatus";
import SelectedView from "@/components/ui/select/SelectedView";
import { useState } from "react";
import { defaultFilter, type ContentFilter } from "@/store/slices/filter";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { Priority } from "@/type/domain/priority";

type FilterDrawerProps = {
  onClose: () => void;
  isOpen: boolean;
};
const FilterDrawer = ({ onClose, isOpen }: FilterDrawerProps) => {
  useScrollLock(isOpen);

  const clearFilter = useAppStore((state) => state.clearFilter);
  const replaceFilter = useAppStore((state) => state.replaceFilter);

  const [draftFilter, setDraftFilter] = useState<ContentFilter>(defaultFilter);

  const setFilter = (filter: ContentFilter) =>
    setDraftFilter((prev) => ({ ...prev, ...filter }));

  const clearDraftFilter = () => setDraftFilter(defaultFilter);

  const togglePriority = (value: Priority) => {
    setDraftFilter((prev) => ({
      ...prev,
      priority: prev.priority === value ? undefined : value,
    }));
  };

  const onClick = () => {
    replaceFilter(draftFilter);
    onClose();
  };

  const resetFilter = () => {
    clearDraftFilter();
    clearFilter();
    onClose();
  };

  return (
    <>
      <div
        className={`overlay ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

      <aside
        className={`fixed top-0 bottom-0 right-0 bg-white w-70 lg:w-100 rounded-l-md transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Filter</h3>
            <Button
              className="border-none text-surface/80 hover:text-black"
              variant="outline"
              size="icon-sm"
              onClick={onClose}
            >
              <X className="size-6" />
            </Button>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium">Priorität</h4>
            <div className="mt-1 flex justify-between">
              {Object.values(PRIORITY_OPTIONS).map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant="filter_drawer"
                  className="rounded-full"
                  onClick={() => togglePriority(opt.value)}
                  data-state={
                    draftFilter.priority === opt.value ? "active" : "inactive"
                  }
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium">Status</h4>
            <div className="mt-1">
              <SelectedStatus
                value={draftFilter.status}
                onChange={(status) => setFilter({ status })}
              />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium">Eigenschaften</h4>
            <div className="mt-1">
              <SelectedView value={draftFilter.view} setFilter={setFilter} />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium">Anhänge</h4>
            <div className="mt-1 flex items-center gap-4">
              <Button
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => setFilter({ hasAttachments: true })}
                data-state={draftFilter.hasAttachments ? "active" : "inactive"}
              >
                Ja
              </Button>
              <Button
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => setFilter({ hasAttachments: false })}
                data-state={
                  draftFilter.hasAttachments === false ? "active" : "inactive"
                }
              >
                Nein
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <Button
              className="w-full bg-accent hover:bg-accent/95 text-black font-semibold"
              onClick={onClick}
            >
              <Search />
              Anzeigen
            </Button>
            <Button className="w-full" onClick={resetFilter}>
              <RotateCcw />
              Zurücksetzten
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default FilterDrawer;

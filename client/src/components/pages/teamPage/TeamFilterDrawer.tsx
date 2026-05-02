import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useTeamQueryState } from "@/hooks/team/useTeamQueryState";
import {
  TEAM_SORT_OPTIONS,
  TEAM_ACTIVITY_OPTIONS,
  TEAM_PROGRESS_OPTIONS,
} from "@/constants/teamFilters";
import { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type TeamFilterDrawerProps = {
  onClose: () => void;
};

const TeamFilterDrawer = ({ onClose }: TeamFilterDrawerProps) => {
  useScrollLock(true);

  const { teamFilter, actions } = useTeamQueryState();

  const filterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(filterRef, () => onClose());

  const onReset = () => {
    actions.resetTeamFilter();
    onClose();
  };

  return (
    <div
      className={
        "absolute top-full right-0 mt-2 w-100 border rounded-md bg-white shadow-xl z-100"
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
          <h4 className="font-medium">Sortierung</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            {TEAM_SORT_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => actions.toggleTeamFilter("sort", opt.value)}
                data-state={
                  teamFilter.sort === opt.value ? "active" : "inactive"
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium">Fortschritt</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            {TEAM_PROGRESS_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => actions.toggleTeamFilter("progress", opt.value)}
                data-state={
                  teamFilter.progress === opt.value ? "active" : "inactive"
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium">Aktivität</h4>
          <div className="mt-1 flex gap-2 flex-wrap">
            {TEAM_ACTIVITY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant="filter_drawer"
                className="rounded-full"
                onClick={() => actions.toggleTeamFilter("activity", opt.value)}
                data-state={
                  teamFilter.activity === opt.value ? "active" : "inactive"
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 border-t">
        <button className="underline text-sm text-surface/90" onClick={onReset}>
          Zurücksetzten
        </button>
      </div>
    </div>
  );
};
export default TeamFilterDrawer;

import { Button } from "@/shared/components/ui/button";
import { Search, Funnel } from "lucide-react";
import { useTeamQueryState } from "@/features/users/hooks/useTeamQueryState";
import { USER_ROLE_FILTER_OPTIONS } from "@/features/users/constants/teamFilters";

type TeamToolbarProps = {
  search: string;
  onChange: (value: string) => void;
  onDrawerOpen: () => void;
};

const TeamToolbar = ({ search, onChange, onDrawerOpen }: TeamToolbarProps) => {
  const { teamFilter, actions } = useTeamQueryState();

  const isTeamFilterActive =
    teamFilter.role !== "all" ||
    teamFilter.activity !== "all" ||
    teamFilter.progress !== undefined ||
    teamFilter.sort !== undefined;

  return (
    <div className="relative flex items-center justify-between border-y py-2">
      <div className="hidden md:flex">
        {USER_ROLE_FILTER_OPTIONS.map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            variant="filter"
            data-state={teamFilter.role === value ? "active" : "inactive"}
            onClick={() => actions.toggleTeamFilter("role", value)}
          >
            <Icon className="size-4" /> {label}
          </Button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="relative w-full xl:w-80">
          <input
            value={search}
            onChange={(e) => onChange(e.target.value)}
            type="text"
            className="search-input"
            placeholder="Suche Mitarbeiter"
          />
          <Search className="absolute left-2 top-1/2 transform  -translate-y-1/2 size-4 text-foreground/70" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="relative text-foreground/90"
          onClick={onDrawerOpen}
        >
          <Funnel /> Filter
          {isTeamFilterActive && (
            <span className="absolute bottom-1 left-1 size-2.5 rounded-full bg-accent"></span>
          )}
        </Button>
      </div>
    </div>
  );
};
export default TeamToolbar;

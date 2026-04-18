import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

type TeamToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
};

const TeamToolbar = ({ search, setSearch }: TeamToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Alle Teammitglieder</h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full border rounded-md h-9 pl-8 pr-4"
            placeholder="Suche..."
          />
          <Search className="absolute left-2 top-1/2 transform  -translate-y-1/2 size-4 text-muted-foreground" />
        </div>

        <Button>
          <Plus className="text-accent" />
          <span>Team</span>
        </Button>
      </div>
    </div>
  );
};
export default TeamToolbar;

import { Button } from "@/shared/components/ui/button";
import TeamToolbar from "./TeamToolbar";
import { Users } from "lucide-react";

type TeamPageHeader = {
  search: string;
  setSearch: (value: string) => void;
  onDrawerOpen: () => void;
};

const TeamPageHeader = ({
  search,
  setSearch,
  onDrawerOpen,
}: TeamPageHeader) => {
  return (
    <header className="mb-5">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
            <Users className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">Team</h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
              Behalte Rollen, Auslastung, Fortschritt und Projektzuordnungen
              deines Teams im Blick.
            </p>
          </div>
        </div>

        <div>
          <Button
            className="w-full bg-accent hover:bg-accent/95 sm:w-auto"
            size="sm"
          >
            Neue Mitarbeiter
          </Button>
        </div>
      </div>

      <TeamToolbar
        search={search}
        onChange={setSearch}
        onDrawerOpen={onDrawerOpen}
      />
    </header>
  );
};
export default TeamPageHeader;

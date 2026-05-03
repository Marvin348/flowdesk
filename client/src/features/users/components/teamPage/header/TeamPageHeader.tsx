import { Button } from "@/shared/components/ui/button";
import TeamToolbar from "./TeamToolbar";

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
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Alle Teammitglieder</h2>

        <div className="flex items-center gap-4">
          <Button className="bg-accent hover:bg-accent/95" size="sm">
            Neue Mitarbeiter
          </Button>
        </div>
      </div>

      <TeamToolbar
        search={search}
        onChange={setSearch}
        onDrawerOpen={onDrawerOpen}
      />
    </>
  );
};
export default TeamPageHeader;

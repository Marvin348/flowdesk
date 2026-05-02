import TeamPerformanceList from "@/components/pages/teamPage/TeamPerformanceList";
import { Spinner } from "@/components/ui/spinner";
import Pagination from "@/components/pagination/Pagination";
import { useState, useEffect } from "react";
import { useTeamMembers } from "@/queries/users/useTeamMembers";
import { useTeamQueryState } from "@/hooks/team/useTeamQueryState";
import { useDebounce } from "@/hooks/useDebounce";
import UserDetails from "@/components/pages/teamPage/UserDetails";
import TeamPageHeader from "@/components/pages/teamPage/header/TeamPageHeader";
import TeamFilterDrawer from "@/components/pages/teamPage/TeamFilterDrawer";

export type SelectedUser = { id: string; name: string };

const TeamPage = () => {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const { page, search, teamFilter, actions } = useTeamQueryState();

  const [searchInput, setSearchInput] = useState(search);
  const debounceInput = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debounceInput !== search) {
      actions.setSearch(debounceInput);
    }
  }, [debounceInput, search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const teamMembersInput = {
    search,
    page,
    limit: 6,
    filter: teamFilter,
  };

  const { data, isLoading, error } = useTeamMembers(teamMembersInput);

  const teamMembers = data?.items ?? [];
  const currentPage = page;
  const totalPages = data?.totalPages ?? 1;

  if (isLoading && !teamMembers.length)
    return (
      <div className="flex-center">
        <Spinner className="size-8 text-accent" />
      </div>
    );
  if (error)
    return (
      <div className="flex-center text-muted-foreground">
        Etwas ist schief gelaufen
      </div>
    );

  return (
    <div className="flex flex-col min-h-full">

      <div className="relative">
          <TeamPageHeader
            search={searchInput}
            setSearch={setSearchInput}
            onDrawerOpen={() => setFilterDrawerOpen(true)}
          />

        {filterDrawerOpen && (
          <TeamFilterDrawer onClose={() => setFilterDrawerOpen(false)} />
        )}
      </div>

      {!teamMembers.length && (
        <div className="mt-6 flex-center w-full text-muted-foreground">
          Keine Daten gefunden
        </div>
      )}

      <div className="mt-6 flex gap-6">
        <section className="flex-1 min-w-0 mb-6">
          <TeamPerformanceList
            teamPerformance={teamMembers}
            onShowDetails={setSelectedUser}
            isDetailsOpen={Boolean(selectedUser)}
          />
        </section>

        {selectedUser && (
          <aside className="w-[360px] mb-6">
            <UserDetails
              selectedUser={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </aside>
        )}
      </div>

      {teamMembers.length > 0 && totalPages > 1 && (
        <div className="flex justify-end mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={actions.setPage}
          />
        </div>
      )}
    </div>
  );
};
export default TeamPage;

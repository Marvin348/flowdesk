import TeamPerformanceList from "@/features/users/components/teamPage/TeamPerformanceList";
import Pagination from "@/shared/components/ui/Pagination";
import { useState, useEffect } from "react";
import { useTeamMembers } from "@/features/users/hooks/useTeamMembers";
import { useTeamQueryState } from "@/features/users/hooks/useTeamQueryState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import UserDetails from "@/features/users/components/teamPage/UserDetails";
import TeamPageHeader from "@/features/users/components/teamPage/header/TeamPageHeader";
import TeamFilterDrawer from "@/features/users/components/teamPage/TeamFilterDrawer";
import TeamPerformanceListSkeleton from "@/features/users/components/teamPage/skeleton/TeamPerformanceListSkeleton";

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

  if (isLoading && !teamMembers.length) return <TeamPerformanceListSkeleton />;

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
            onSelectUser={setSelectedUser}
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

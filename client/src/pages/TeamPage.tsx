import TeamPerformanceList from "@/components/pages/teamPage/TeamPerformanceList";
import TeamToolbar from "@/components/pages/teamPage/toolbar/TeamToolbar";
import { Spinner } from "@/components/ui/spinner";
import Pagination from "@/components/pagination/Pagination";
import AssignProjectModal from "@/components/pages/teamPage/AssignProjectModal";
import { useState, useEffect } from "react";
import { useTeamMembers } from "@/queries/users/useTeamMembers";
import { useTeamQueryState } from "@/hooks/useTeamQueryState";
import { useDebounce } from "@/hooks/useDebounce";

const TeamPage = () => {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { page, search, actions } = useTeamQueryState();

  const [searchInput, setSearchInput] = useState(search);
  const debounceInput = useDebounce(searchInput, 300);

  useEffect(() => {
    actions.setSearch(debounceInput);
  }, [debounceInput]);

  const teamMembersInput = {
    search,
    page,
    limit: 6,
  };

  const { data, isLoading, error } = useTeamMembers(teamMembersInput);

  const teamMembers = data?.items ?? [];
  const currentPage = page;
  const totalPages = data?.totalPages ?? 1;

  const onSelectUser = (id: string, name: string) =>
    setSelectedUser({ id, name });

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
      <div className="mb-6">
        <TeamToolbar search={searchInput} onChange={setSearchInput} />
      </div>

      <section className="mb-6">
        <TeamPerformanceList
          teamPerformance={teamMembers}
          onSelectUser={onSelectUser}
        />
      </section>

      {!teamMembers.length && (
        <div className="flex-center text-muted-foreground">
          Keine Daten gefunden
        </div>
      )}

      {teamMembers.length > 0 && totalPages > 1 && (
        <div className="flex justify-end mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={actions.setPage}
          />
        </div>
      )}

      {selectedUser && (
        <AssignProjectModal
          onClose={() => setSelectedUser(null)}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};
export default TeamPage;

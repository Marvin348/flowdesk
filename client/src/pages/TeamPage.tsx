import TeamPerformanceList from "@/components/pages/teamPage/TeamPerformanceList";
import TeamToolbar from "@/components/pages/teamPage/toolbar/TeamToolbar";
import { Spinner } from "@/components/ui/spinner";
import Pagination from "@/components/pagination/Pagination";
import AssignProjectModal from "@/components/pages/teamPage/AssignProjectModal";
import { useEffect, useState } from "react";
import { useTeamMembers } from "@/queries/users/useTeamMembers";
import { useDebounce } from "@/hooks/useDebounce";

const TeamPage = () => {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debounceInput = useDebounce(search, 300);

  const onSelectUser = (id: string, name: string) =>
    setSelectedUser({ id, name });

  const teamMembersInput = {
    search: debounceInput,
    page,
    limit: 6,
  };

  const { data, isLoading, error } = useTeamMembers(teamMembersInput);

  const teamMembers = data?.items ?? [];
  const currentPage = page;
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setPage(1)
  }, [search]);

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
        <TeamToolbar search={search} setSearch={setSearch} />
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

      {teamMembers.length > 0 && (
        <div className="flex justify-end mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setPage}
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

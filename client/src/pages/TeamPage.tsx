import { useUsers } from "@/queries/users/useUsers";
import { useTasks } from "@/queries/tasks/useTasks";
import { getUserPerformance } from "@/utils/performance/getUserPerformance";
import TeamPerformanceList from "@/components/pages/teamPage/TeamPerformanceList";
import TeamToolbar from "@/components/pages/teamPage/toolbar/TeamToolbar";
import { Spinner } from "@/components/ui/spinner";
import { usePagination } from "@/hooks/usePagination";
import TeamPagination from "@/components/pages/teamPage/TeamPagination";
import AssignProjectModal from "@/components/pages/teamPage/AssignProjectModal";
import { useState } from "react";

const TeamPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const onSelectUserId = (id: string) => setSelectedUserId(id);

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks();

  const isLoading = usersLoading || tasksLoading;
  const error = usersError ?? tasksError;

  const userPerformance = getUserPerformance(users, tasks);

  const { currentPage, setCurrentPage, pageData, totalPages } =
    usePagination(userPerformance);

    const selectedUser = users.find((u) => u.id === selectedUserId);
    console.log("selectedUser", selectedUser)

  if (isLoading) return <Spinner />;

  console.log("selectedUserId", selectedUserId);

  return (
    <div>
      <div className="my-6">
        <TeamToolbar />
      </div>

      <section>
        <TeamPerformanceList
          teamPerformance={pageData}
          onSelectUserId={onSelectUserId}
        />
      </section>

      <div>
        <TeamPagination
          currentPage={currentPage}
          prev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          next={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          totalPages={totalPages}
        />
      </div>

      {selectedUserId && (
        <AssignProjectModal
          onClose={() => setSelectedUserId(null)}
          selectedUserId={selectedUserId}
        />
      )}
    </div>
  );
};
export default TeamPage;

import { useUsers } from "@/queries/users/useUsers";
import { useTasks } from "@/queries/tasks/useTasks";
import { getUserPerformance } from "@/utils/performance/getUserPerformance";
import TeamPerformanceList from "@/components/pages/teamPage/TeamPerformanceList";
import TeamToolbar from "@/components/pages/teamPage/toolbar/TeamToolbar";
import { Spinner } from "@/components/ui/spinner";
import { usePagination } from "@/hooks/usePagination";
import TeamPagination from "@/components/pages/teamPage/TeamPagination";
import { getTeamStats } from "@/utils/performance/getTeamStats";
import OverviewStats from "@/components/performance/OverviewStats";
import { getTeamStatCards } from "@/utils/performance/getTeamStatCards";

const TeamPage = () => {
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
  const teamStats = getTeamStats(userPerformance);
  const statCards = getTeamStatCards(teamStats);

  const { currentPage, setCurrentPage, pageData, totalPages } =
    usePagination(userPerformance);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <section>
        <OverviewStats stats={statCards} />
      </section>

      <div className="my-6">
        <TeamToolbar />
      </div>

      <section>
        <TeamPerformanceList teamPerformance={pageData} />
      </section>

      <div>
        <TeamPagination
          currentPage={currentPage}
          prev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          next={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};
export default TeamPage;

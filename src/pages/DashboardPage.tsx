import { useProjectDomainAll } from "@/domain/projects/useProjectDomainAll";
import { useCoreData } from "@/domain/projects/useCoreData";
import { getDashboardOverviewStats } from "@/utils/overview/getDashboardOverviewStats";
import DashboardStats from "@/components/pages/dashboardPage/stats/DashboardStats";
import { getDashboardStatCards } from "@/utils/overview/getDashboardStatCards";

const DashboardPage = () => {
  const {
    data: { users, comments, tasks, attachments },
  } = useProjectDomainAll();

  const { projects } = useCoreData();

  const dashboardOverviewStats = getDashboardOverviewStats(projects, tasks);
  const statCards = getDashboardStatCards(dashboardOverviewStats);

  return (
    <div>
      <div>
        <DashboardStats stats={statCards}/>
        </div>
    </div>
  );
};
export default DashboardPage;

import { useProjectDomainAll } from "@/domain/projects/useProjectDomainAll";
import { useCoreData } from "@/domain/projects/useCoreData";
import { getDashboardOverviewStats } from "@/utils/dashboard/getDashboardOverviewStats";
import DashboardStats from "@/components/pages/dashboardPage/stats/DashboardStats";
import { mapDashboardStatCards } from "@/utils/dashboard/mapDashboardStatCards";
import { getTaskStatusDistribution } from "@/utils/dashboard/getTaskStatusDistribution";
import TaskStatusDistribution from "@/components/pages/dashboardPage/statusDistribution/TaskStatusDistribution";
import { mapTaskStatusDistributionToItems } from "@/utils/dashboard/mapTaskStatusDistributionToItems";
import PriorityChartSection from "@/components/pages/dashboardPage/charts/PriorityChartSection";

const DashboardPage = () => {
  const {
    data: { users, comments, tasks, attachments },
  } = useProjectDomainAll();

  const { projects } = useCoreData();

  const dashboardOverviewStats = getDashboardOverviewStats(projects, tasks);
  const statCards = mapDashboardStatCards(dashboardOverviewStats);

  const taskStatusDistribution = getTaskStatusDistribution(tasks);
  const taskStatusItems = mapTaskStatusDistributionToItems(
    taskStatusDistribution,
  );

  console.log("tasks", tasks)
  console.log("taskStatusItems", taskStatusItems);

  return (
    <div>
      <section>
        <DashboardStats stats={statCards} />
      </section>

      <section className="mt-6">
        <TaskStatusDistribution items={taskStatusItems} />
      </section>

      <section className="mt-6">
        <PriorityChartSection />
      </section>
    </div>
  );
};
export default DashboardPage;

import { useProjectDomainAll } from "@/domain/projects/useProjectDomainAll";
import { useCoreData } from "@/domain/projects/useCoreData";
import { getDashboardOverviewStats } from "@/utils/dashboard/getDashboardOverviewStats";
import DashboardStats from "@/components/pages/dashboardPage/stats/DashboardStats";
import { mapDashboardStatCards } from "@/utils/dashboard/mapDashboardStatCards";
import { getTaskStatusDistribution } from "@/utils/dashboard/getTaskStatusDistribution";
import TaskStatusDistribution from "@/components/pages/dashboardPage/statusDistribution/TaskStatusDistribution";
import { mapTaskStatusDistributionToItems } from "@/utils/dashboard/mapTaskStatusDistributionToItems";
import PriorityChartSection from "@/components/pages/dashboardPage/charts/PriorityChartSection";
import { getTaskPriorityItems } from "@/utils/dashboard/getTaskPriorityItems";

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

  const taskPriorityItems = getTaskPriorityItems(tasks);

  console.log("taskPriorityItems", taskPriorityItems);

  return (
    <div>
      <section>
        <DashboardStats stats={statCards} />
      </section>

    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
      <section>
        <TaskStatusDistribution statusItems={taskStatusItems} />
      </section>

      <section>
        <PriorityChartSection priorityItems={taskPriorityItems}/>
      </section>
    </div>
    </div>
  );
};
export default DashboardPage;

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
import UpcomingTasks from "@/components/pages/dashboardPage/upcomingTasks/UpcomingTasks";
import { getUpcomingTasks } from "@/utils/dashboard/tasks/getUpcomingTasks";

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

  const upcomingTasks = getUpcomingTasks(projects, tasks);

  // md:grid-cols-2

  return (
    <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
      <div className="col-span-1 xl:col-span-4 grid gap-6">
        <DashboardStats stats={statCards} />
        <TaskStatusDistribution statusItems={taskStatusItems} />
      </div>

      <div className="col-span-1 xl:col-span-2">
        <PriorityChartSection priorityItems={taskPriorityItems} />
      </div>

      <div className="col-span-1 xl:col-span-4">
        <UpcomingTasks upcomingTasks={upcomingTasks} />
      </div>
    </div>
  );
};
export default DashboardPage;

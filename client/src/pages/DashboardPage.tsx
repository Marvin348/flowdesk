import { useProjectDomainAll } from "@/domain/projects/useProjectDomainAll";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { getDashboardOverviewStats } from "@/features/dashboard/utils/getDashboardOverviewStats";
import DashboardStats from "@/features/dashboard/components/stats/DashboardStats";
import { mapDashboardStatCards } from "@/features/dashboard/utils/mapDashboardStatCards";
import { getTaskStatusDistribution } from "@/features/dashboard/utils/getTaskStatusDistribution";
import TaskStatusDistribution from "@/features/dashboard/components/statusDistribution/TaskStatusDistribution";
import { mapTaskStatusDistributionToItems } from "@/features/dashboard/utils/mapTaskStatusDistributionToItems";
import PriorityChartSection from "@/features/dashboard/components/charts/PriorityChartSection";
import { getTaskPriorityItems } from "@/features/dashboard/utils/getTaskPriorityItems";
import UpcomingTasks from "@/features/dashboard/components/upcomingTasks/UpcomingTasks";
import { getUpcomingTasks } from "@/features/dashboard/utils/getUpcomingTasks";
import { getUserPerformance } from "@/features/users/utils/getUserPerformance";
import PerformanceHighlights from "@/features/dashboard/components/performanceHighlights/PerformanceHighlights";
import { getPerformanceHighlights } from "@/features/dashboard/utils/getPerformanceHighlights";

const DashboardPage = () => {
  // refactor later
  const {
    data: { users, comments, tasks, attachments },
  } = useProjectDomainAll();

  const { data: projects = [], isLoading, error } = useProjects();

  const dashboardOverviewStats = getDashboardOverviewStats(projects, tasks);
  const statCards = mapDashboardStatCards(dashboardOverviewStats);

  const taskStatusDistribution = getTaskStatusDistribution(tasks);
  const taskStatusItems = mapTaskStatusDistributionToItems(
    taskStatusDistribution,
  );

  const taskPriorityItems = getTaskPriorityItems(tasks);

  const upcomingTasks = getUpcomingTasks(projects, tasks);

  const performance = getUserPerformance(users, tasks);
  const performanceHighlights = getPerformanceHighlights(performance);

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

      <div className="xl:col-span-2">
        <PerformanceHighlights highlights={performanceHighlights} />
      </div>

      <div className="col-span-1 xl:col-span-4">
        <UpcomingTasks upcomingTasks={upcomingTasks} />
      </div>
    </div>
  );
};
export default DashboardPage;

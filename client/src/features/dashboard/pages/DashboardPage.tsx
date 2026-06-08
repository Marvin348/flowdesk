import DashboardStats from "@/features/dashboard/components/stats/DashboardStats";
import { mapDashboardStatCards } from "@/features/dashboard/mappers/mapDashboardStatCards";
import TaskStatusDistribution from "@/features/dashboard/components/statusDistribution/TaskStatusDistribution";
import { mapTaskStatusDistribution } from "@/features/dashboard/mappers/mapTaskStatusDistribution";
import PriorityChartSection from "@/features/dashboard/components/charts/PriorityChartSection";
import UpcomingTasks from "@/features/dashboard/components/upcomingTasks/UpcomingTasks";
import PerformanceHighlights from "@/features/dashboard/components/performanceHighlights/PerformanceHighlights";
import { mapTaskPriorityItems } from "@/features/dashboard/mappers/mapTaskPriorityItems";
import DashboardSkeleton from "@/features/dashboard/components/skeleton/DashboardSkeleton";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";

const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <div>Etwas ist schief gelaufen</div>;

  const {
    overviewStats,
    taskStatusDistribution,
    taskPriorityDistribution,
    upcomingTasks,
    performanceHighlights,
  } = data;

  const statCards = mapDashboardStatCards(overviewStats);
  const taskStatusItems = mapTaskStatusDistribution(taskStatusDistribution);
  
  const taskPriorityItems = mapTaskPriorityItems(taskPriorityDistribution);
  
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

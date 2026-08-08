import DashboardStats from "@/features/dashboard/components/stats/DashboardStats";
import { mapDashboardStatCards } from "@/features/dashboard/mappers/mapDashboardStatCards";
import DashboardSkeleton from "@/features/dashboard/components/skeleton/DashboardSkeleton";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import DashboardZeroState from "@/features/dashboard/components/DashboardZeroState";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardFocusArea from "@/features/dashboard/components/DashboardFocusArea";

const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <div>Etwas ist schief gelaufen</div>;

  const {
    overviewStats,
    urgentTasks,
    attentionRequired,
    taskStatusDistribution,
  } = data;

  const statCards = mapDashboardStatCards(overviewStats);

  const hasNoProjects = overviewStats.activeProjects === 0;

  if (hasNoProjects) return <DashboardZeroState />;

  return (
    <>
      <DashboardHeader />
      <DashboardStats stats={statCards} />

      <DashboardFocusArea
        urgentTasks={urgentTasks}
        attentionRequired={attentionRequired}
        taskStatusDistribution={taskStatusDistribution}
      />
    </>
  );
};
export default DashboardPage;

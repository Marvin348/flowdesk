import {
  CardSkeleton,
  DashboardStatsSkeleton,
  PieChartSkeleton,
  UpcomingTasksSkeleton,
} from "@/features/dashboard/components/skeleton/CardSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">

      <div className="col-span-1 xl:col-span-4 grid gap-6">
        <DashboardStatsSkeleton />
        <CardSkeleton /> 
      </div>

      <div className="col-span-1 xl:col-span-2">
        <PieChartSkeleton />
      </div>

      <div className="xl:col-span-2">
        <CardSkeleton />
      </div>

      
      <div className="col-span-1 xl:col-span-4">
        <UpcomingTasksSkeleton />
      </div>
    </div>
  );
};
export default DashboardSkeleton;

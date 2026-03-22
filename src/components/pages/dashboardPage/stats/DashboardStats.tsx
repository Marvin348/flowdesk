import type { StatCardItem } from "@/utils/dashboard/mapDashboardStatCards";
import DashboardStatCard from "./DashboardStatCard";

const DashboardStats = ({ stats }: { stats: StatCardItem[] }) => {
  return (
    <div className="grid grid-cols-4 items-center border rounded-md p-4">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};
export default DashboardStats;

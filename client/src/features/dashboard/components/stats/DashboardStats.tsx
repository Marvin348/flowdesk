import type { StatCardItem } from "@/features/dashboard/mappers/mapDashboardStatCards";
import DashboardStatCard from "./DashboardStatCard";

const DashboardStats = ({ stats }: { stats: StatCardItem[] }) => {
  const orderedStats = [
    ...stats.filter((stat) => stat.id === "tasksDueThisWeek"),
    ...stats.filter((stat) => stat.id !== "tasksDueThisWeek"),
  ];

  return (
    <section className="mb-6 rounded-md border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {orderedStats.map((stat, index) => (
          <DashboardStatCard
            key={stat.id}
            stat={stat}
            isPrimary={index === 0}
          />
        ))}
      </div>
    </section>
  );
};
export default DashboardStats;

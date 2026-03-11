import OverviewStatCard from "./OverviewStatCard";
import type { StatCardItem } from "@/utils/performance/getTeamStatCards";

const OverviewStats = ({ stats }: { stats: StatCardItem[] }) => {
  return (
    <div className="grid grid-cols-4 items-center border rounded-md p-4">
      {stats.map((sta) => (
        <OverviewStatCard key={sta.id} stats={sta} />
      ))}
    </div>
  );
};
export default OverviewStats;

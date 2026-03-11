import type { UserPerformance } from "@/utils/performance/getUserPerformance";
import UserPerformanceItem from "./TeamPerformanceItem";

type TeamPerformanceListProps = {
  teamPerformance: UserPerformance[];
};

const TeamPerformanceList = ({ teamPerformance }: TeamPerformanceListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {teamPerformance.map((u) => (
        <UserPerformanceItem item={u} key={u.id} />
      ))}
    </div>
  );
};
export default TeamPerformanceList;

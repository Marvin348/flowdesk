import type { UserPerformance } from "@/utils/performance/getUserPerformance";
import UserPerformanceItem from "./TeamPerformanceItem";

type TeamPerformanceListProps = {
  teamPerformance: UserPerformance[];
  onSelectUserId: (id: string) => void;
};

const TeamPerformanceList = ({
  teamPerformance,
  onSelectUserId,
}: TeamPerformanceListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {teamPerformance.map((u) => (
        <UserPerformanceItem
          key={u.id}
          item={u}
          onSelectUserId={onSelectUserId}
        />
      ))}
    </div>
  );
};
export default TeamPerformanceList;

import type { UserPerformance } from "@/features/users/utils/getUserPerformance";
import UserPerformanceItem from "./TeamPerformanceItem";
import type { SelectedUser } from "@/pages/TeamPage";

type TeamPerformanceListProps = {
  teamPerformance: UserPerformance[];
  onSelectUser: (user: SelectedUser) => void;
  isDetailsOpen: boolean;
};

const TeamPerformanceList = ({
  teamPerformance,
  onSelectUser,
  isDetailsOpen,
}: TeamPerformanceListProps) => {
  // grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6
  return (
    <div
      className={`grid grid-cols-1 gap-6 ${isDetailsOpen ? "xl:grid-cols-2 2xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3"}`}
    >
      {teamPerformance.map((u) => (
        <UserPerformanceItem
          key={u.id}
          item={u}
          onSelectUser={onSelectUser}
        />
      ))}
    </div>
  );
};
export default TeamPerformanceList;

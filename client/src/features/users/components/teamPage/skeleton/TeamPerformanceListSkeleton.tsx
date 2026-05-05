import TeamPerformanceCardSkeleton from "@/features/users/components/teamPage/skeleton/TeamPerformanceCardSkeleton";

const TeamPerformanceListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <TeamPerformanceCardSkeleton key={i} />
      ))}
    </div>
  );
};
export default TeamPerformanceListSkeleton;

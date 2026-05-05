import {
  OverviewCardSkeleton,
  SmallOverviewCardSkeleton,
} from "@/features/projects/components/projectDetailsPage/skeleton/OverviewCardSkeleton";
const DetailsOverviewSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto md:auto-rows-[170px]">
      <OverviewCardSkeleton className="md:row-span-2" />
      <OverviewCardSkeleton className="md:row-span-2" />

      <SmallOverviewCardSkeleton className="xl:col-start-3 xl:row-span-1" />

      <OverviewCardSkeleton className="xl:col-start-3 xl:row-start-2 xl:row-span-3" />
      <OverviewCardSkeleton className="md:col-span-2 xl:row-span-2" />
    </div>
  );
};
export default DetailsOverviewSkeleton;

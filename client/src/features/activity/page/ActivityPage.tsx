import { useActivities } from "@/features/activity/hooks/useActivities";
import ActivityList from "@/features/activity/components/ActivityList";
import ActivityPageHeader from "@/features/activity/components/ActivityPageHeader";
import ActivityPageSkeleton from "@/features/activity/components/ActivityPageSkeleton";

const ActivityPage = () => {
  const { data, isLoading, error } = useActivities();

  const activities = data ?? [];

  if (isLoading && !activities.length) return <ActivityPageSkeleton />;

  if (error)
    return (
      <div className="flex-center text-muted-foreground">
        Etwas ist schief gelaufen
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <ActivityPageHeader />
      </div>

      <div>
        <ActivityList activities={activities} />
      </div>
    </div>
  );
};
export default ActivityPage;

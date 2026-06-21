import { useActivities } from "@/features/activity/hooks/useActivities";
import ActivityToolbar from "@/features/activity/components/ActivityToolbar";
import ActivityList from "@/features/activity/components/ActivityList";

const ActivityPage = () => {
  const { data: activities, isLoading, error } = useActivities();

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log(activities);

  return (
    <div>
      <div>
        <ActivityToolbar />
      </div>

      <div>
        <ActivityList activities={activities ?? []}/>
      </div>
    </div>
  );
};
export default ActivityPage;

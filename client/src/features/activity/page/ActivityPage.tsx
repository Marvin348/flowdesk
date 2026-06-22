import { useActivities } from "@/features/activity/hooks/useActivities";
import ActivityList from "@/features/activity/components/ActivityList";
import ActivityPageHeader from "../components/ActivityPageHeader";

const ActivityPage = () => {
  const { data: activities, isLoading, error } = useActivities();

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log(activities);

  return (
    <div>
      <div className="mb-6">
        <ActivityPageHeader/>
      </div>

      <div>
        <ActivityList activities={activities ?? []}/>
      </div>
    </div>
  );
};
export default ActivityPage;

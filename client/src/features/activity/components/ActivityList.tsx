import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";
import ActivityItem from "./ActivityItem";

const ActivityList = ({ activities }: { activities: ActivityDto[] }) => {
  return (
    <section>
      ActivityList
      <div>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
};
export default ActivityList;
